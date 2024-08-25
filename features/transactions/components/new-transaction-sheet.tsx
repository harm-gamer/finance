import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useNewTransaction } from "../hooks/use-new-transaction";
import {z }from "zod"
import { insertTransactionSchema, transactions } from "@/db/schema";
import { useCreateTransaction } from "../api/use-create-transaction";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useCreateCategories } from "@/features/categories/api/use-create-categories";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";
import { TransactionForm } from "./transaction-form";
import { Loader2 } from "lucide-react";
const formSchema = insertTransactionSchema.omit({
    id: true
})
type FormValues = z.input<typeof formSchema>;
export const NewTransactionSheet = () =>{
    const {isOpen,onClose} = useNewTransaction();
    const createmutation = useCreateTransaction();
    
       const categoryQuery = useGetCategories();
       const categoryMutation = useCreateCategories();
       const onCreateCategory = (name: string) => categoryMutation.mutate({
        name
       })
       const categoryOPtions = (categoryQuery.data ??[]).map((category) =>({
        label : category.name,
        value : category.id
       }))

       const accountQuery = useGetAccounts();
       const accountMutation = useCreateAccount();
       const onCreateAccount = (name: string) => accountMutation.mutate({
        name
       })
       const accountOPtions = (accountQuery.data ??[]).map((account) =>({
        label : account.name,
        value : account.id
       }))

       const isPending = createmutation.isPending || categoryMutation.isPending || accountMutation.isPending;
       const isLoading = categoryQuery.isLoading || accountQuery.isLoading;

    const onSubmit = (values:FormValues) =>{
       createmutation.mutate(values,{
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
                        New Transaction
                    </SheetTitle>
                    <SheetDescription>
                       Add a new transaction
                    </SheetDescription>
                </SheetHeader>
                {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="size-4 text-muted-foreground animate-spin"/>
                    </div>
                ):(
                    <TransactionForm 
                    onSubmit={onSubmit}
                    disabled={false}
                    categoryOptions={categoryOPtions}
                    onCreateCategory={onCreateCategory}
                    accountOptions={accountOPtions}
                    onCreateAccount={onCreateAccount}
                 />
                )}
              
            </SheetContent>
        </Sheet>
    )
}