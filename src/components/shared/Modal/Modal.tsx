"use client";
import {useSearchParams, usePathname} from "next/navigation";
import Link from "next/link";

interface ModalProps {
    index?: number | string,
    name: string,
    item?: any[],
    modalContent?: React.ReactNode;
}
function Modal({index, name, item, modalContent}:ModalProps) {
    const searchParams = useSearchParams();
    const modal = searchParams.get(`${name}${index ?? ''}`);
    const pathname = usePathname();

    return (
        <>
            {modal &&
                <dialog
                style={{zIndex:'9000'}}
                    className="fixed left-0 top-0 w-full h-full bg-black bg-opacity-50 overflow-auto backdrop-blur flex justify-center items-center">
                    {modalContent}
                </dialog>
            }
        </>
    );
}

export default Modal;
