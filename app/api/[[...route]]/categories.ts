import {Hono} from "hono"
import {createId}  from "@paralleldrive/cuid2"
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import {db} from "@/db/drizzle"
import {zValidator} from "@hono/zod-validator"
import { categories, insertCategorieSchema } from "@/db/schema";
import { eq ,and, inArray} from "drizzle-orm";
import { z } from "zod";



const app = new Hono()
.get("/", clerkMiddleware(),async (c) =>{
    const auth = getAuth(c);
    if(!auth?.userId){
        return c.json({error : "unauthorized"},401);
    }

    const data = await db.select({
        id : categories.id,
        name :categories.name,

    }).from(categories).where(eq(categories.userId,auth.userId));
    return c.json({data});
})
.get("/:id",zValidator("param",z.object({
    id: z.string().optional(),
})),
clerkMiddleware(),
async (c) => {
    const auth = getAuth(c);
    const {id} = c.req.valid("param");

    if(!id){
        return c.json({error : "missing id"},401);
    }
    if(!auth?.userId){
        return c.json({error : "unAuthorized"},401);
    }

    const [data] = await db.select({id : categories.id,name : categories.name})
    .from(categories).where(and(eq(categories.userId,auth.userId),eq(categories.id,id)))

    if(!data){
        return c.json({error : "Not found"},404);
    }
    return c.json({data});
}
)
.post("/", clerkMiddleware(),zValidator("json", insertCategorieSchema.pick({
    name : true,
})), async (c) =>{
    const values = c.req.valid("json");
    const auth = getAuth(c);

    if(!auth?.userId){
        return c.json({error : "unauthorized"},401);
    }
    const [data] = await db.insert(categories).values({
        id : createId(),
        userId : auth.userId,
        ...values,
    }).returning();
    return c.json({data})
})
.post("/bulk-delete", clerkMiddleware(), zValidator("json",z.object({ids: z.array(z.string())})), async (c) =>{
      const values = c.req.valid("json");
      const auth = getAuth(c);

      if(!auth?.userId){
        return c.json({error : "unauthorized"},401);

      }

      const data = await db.delete(categories).where(and(eq(categories.userId,auth.userId),inArray(categories.id,values.ids))).returning({id: categories.id})
            return c.json({data});
            
})
.patch("/:id",zValidator("param",z.object({id : z.string().optional()})),zValidator("json",insertCategorieSchema.pick({name:true})),clerkMiddleware(), async (c) =>{
     const auth = getAuth(c);
     const {id }= c.req.valid("param");
     const values = c.req.valid("json");
     if(!id){
        return c.json({error : "missing id"},400);

     }
     if(!auth?.userId){
      return c.json({error : "Authorized to update"},401)
     }

     const [data] = await db.update(categories).set(values).where(and(eq(categories.userId,auth.userId),eq(categories.id,id))).returning()
      if(!data){
        return c.json({error : "Not found"},404);
      }
       return c.json({data})
})
.delete("/:id",zValidator("param",z.object({id : z.string().optional()})),clerkMiddleware(), async (c) =>{
    const auth = getAuth(c);
    const {id }= c.req.valid("param");
   
    if(!id){
       return c.json({error : "missing id"},400);

    }
    if(!auth?.userId){
     return c.json({error : "Authorized to update"},401)
    }

    const [data] = await db.delete(categories).where(and(eq(categories.userId,auth.userId),eq(categories.id,id))).returning({id : categories.id})
     if(!data){
       return c.json({error : "Not found"},404);
     }
     return c.json({data});
})

export default app;