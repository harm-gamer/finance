import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useNewCategory } from "../hooks/use-new-category";
import { CategorieForm } from "./categorie-form";
import {  insertCategorieSchema } from "@/db/schema";
import { z } from "zod";
import { useCreateCategories } from "../api/use-create-categories";
const formSchema = insertCategorieSchema.pick({
    name: true
})
type FormValues = z.input<typeof formSchema>;
export const NewCategorieSheet = () =>{
    const mutation = useCreateCategories();
    const {isOpen,onClose} = useNewCategory();
    const onSubmit = (values:FormValues) =>{
       mutation.mutate(values,{
        onSuccess : () =>{
            onClose();
        }
       });
      
    }
    
   
    return(
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>
                        New Category
                    </SheetTitle>
                    <SheetDescription>
                        Create a new Category to track your transactions.
                    </SheetDescription>
                </SheetHeader>
                <CategorieForm onSubmit={onSubmit}  disabled={mutation.isPending} defaultValues={{name : "" }}/>
            </SheetContent>
        </Sheet>
    )
}