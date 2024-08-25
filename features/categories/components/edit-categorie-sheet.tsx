import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useOpenCategory } from "../hooks/use-open-category";
import { CategorieForm } from "./categorie-form";
import { insertCategorieSchema } from "@/db/schema";
import { z } from "zod";
import { useCreateCategories } from "../api/use-create-categories";
import { useGetCategorie } from "../api/use-get-categorie";
import { Loader2 } from "lucide-react";
import { useEditCategorie } from "../api/use-edit-categories";
import { useDeleteCaterogies } from "../api/use-delete-categories";
import { useConfirm } from "@/hooks/use-confirm";
const formSchema = insertCategorieSchema.pick({
    name: true
})
type FormValues = z.input<typeof formSchema>;
export const EditCategorieSheet = () =>{
    const {isOpen,onClose,id} = useOpenCategory();
    const[ConfirmationDialog, confirm] = useConfirm(
        "Are you sure",
        "you are about to delete transaction"
    )
 
    const categorieQuery = useGetCategorie(id)
    const editMutaion  = useEditCategorie(id)
    const deleteMutation = useDeleteCaterogies(id)
  
  
    const isLoading = categorieQuery.isLoading;
    const isPending = editMutaion.isPending || deleteMutation.isPending;
    const onSubmit = (values:FormValues) =>{
       editMutaion.mutate(values,{
        onSuccess : () =>{
            onClose();
        }
       });
      
    }
    const onDelete = async () =>{
        const ok = await confirm();
        if(ok){
    deleteMutation.mutate(undefined,{
        onSuccess : () =>{
            onClose();
        }
    })
        }
    }

    const defaultValues = categorieQuery.data?{
        name : categorieQuery.data.name
    }:{
        name : "",
    }
    
   
    return(
        <>
        <ConfirmationDialog/>
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>
                        Edit Categorie
                    </SheetTitle>
                    <SheetDescription>
                        Edit a new Categorie to track your transactions.
                    </SheetDescription>
                </SheetHeader>
                {isLoading ?(
                    <div className="absolute insert-0 flex items-center justify-center">
                        <Loader2 className="size-4 text-muted-foreground animate-spin"/>
                    </div>
                ):(
                    <CategorieForm onSubmit={onSubmit} id={id} disabled={isPending} defaultValues={defaultValues} onDelete={() => deleteMutation.mutate()}/>
                )}
               
            </SheetContent>
        </Sheet>
        </>
    )
}