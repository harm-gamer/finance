import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useState } from "react"

export const useConfirm = (
    tittle : string,
    message : string,
):[()=> JSX.Element,()=> Promise<unknown>] =>{
    const [promise,setPromise] = useState<{resolve : (value : boolean) => void} | null>(null);
   
    const confirm = () => new Promise((resolve,reject) =>{
        setPromise({resolve})
    })
    const handleClose =() =>{
        setPromise(null);
    }

    const handleConfirm = () =>{
        promise?.resolve(false);
        handleClose();
    }
    const handleCancel = () =>{
        promise?.resolve(false);
        handleClose();
    };

    const ConfirmationDialog = () =>(
        <Dialog open={promise !== null}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{tittle}</DialogTitle>
                    <DialogDescription>{message}</DialogDescription>
                </DialogHeader>
                <DialogFooter className="pt-2">
                   <Button onClick={handleCancel} variant="outline">
                    cancel
                   </Button>
                   <Button onClick={handleConfirm} >
                    Confirm
                   </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
    return [ConfirmationDialog,confirm]
}