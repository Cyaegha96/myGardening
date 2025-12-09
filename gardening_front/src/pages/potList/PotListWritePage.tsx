import PotListWriteForm from "@/features/potList/ui/PotListWriteForm.tsx";
import {useNavigate} from "react-router-dom";

type PotListWritePageProps = {
    mode: "create" | "edit";
};

export default function PotListWritePage({mode}:PotListWritePageProps) {
    const navigate = useNavigate();
    return (
        <div className="max-w-6xl mx-auto mt-5 px-4 mb-5">
            <PotListWriteForm onSubmitSuccess={() => navigate("/pot-list")} mode={mode}/>
        </div>
    );
}
