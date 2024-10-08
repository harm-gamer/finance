"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UploadButton } from "./upload-button"
import { Loader2, Plus } from "lucide-react"
import { columns}  from "./columns"
import { DataTable } from "@/components/data-table"

import { Skeleton } from "@/components/ui/skeleton"
import { useBulkDelete } from "@/features/transactions/api/use-bulk-delete-transaction"
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction"
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions"
import { useState } from "react"
import { ImportCard } from "./import-card"

enum VARIANTS{
    LIST ="LIST",
    IMPORT="IMPORT"
};

const INITIAL_IMPORT_RESULTS = {
    data:[],
    errors:[],
    meta:{},
}
 

const TransactionPage = () =>{
   const [variant,setVariant] = useState<VARIANTS>(VARIANTS.LIST);
   const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS);
    const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) =>{
        console.log({results})
        setImportResults(results);
        setVariant(VARIANTS.IMPORT);
    }

    const onCancelImport = () =>{
        setImportResults(INITIAL_IMPORT_RESULTS);
        setVariant(VARIANTS.LIST)
    }

    const NewTransaction = useNewTransaction()
    const deletetransactions = useBulkDelete();
    const transactionQuery = useGetTransactions();
    const transactions = transactionQuery.data || []

    const isDisabled = transactionQuery.isLoading || deletetransactions.isPending;

    if(transactionQuery.isLoading){
        return (
            <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
             <Card className="border-none drop-shadow-sm">
                <CardHeader>
                    <Skeleton className="h-8 w-48"/>
                </CardHeader>
                <CardContent>
                    <div className="h-[500px] w-full flex items-center justify-center">
                     <Loader2 className="size-6 text-slate-300 animate-spin"/>
                    </div>
                </CardContent>
             </Card>
            </div>
        )
    }
    if(variant === VARIANTS.IMPORT){
      return(
        <>
       <ImportCard 
        data={importResults.data}
        onCancel={onCancelImport}
        onSubmit={()=>{}}
       />
        </>
      )
    }
    return(
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none drop-shadow-sm">
          <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle className="text-xl line-clamp-1">
                Transaction History
            </CardTitle>
            <div className="flex flex-col lg:flex-row gap-y-2 items-center gap-x-2">
            <Button  onClick={NewTransaction.onOpen} size="sm" className="w-full lg:auto">
                <Plus  className="size-4 mr-2"/>
                Add new
            </Button>
            <UploadButton onUpload={onUpload}/>
            </div>
          </CardHeader>
             <CardContent>
                <DataTable filterKey="payee" data={transactions} columns={columns} onDelete={(row) =>{
                    const ids = row.map((r) => r.original.id);
                    deletetransactions.mutate({ids});
                }} disabled={isDisabled}/>
             </CardContent>
            </Card>
        </div>
    )
}
export default TransactionPage