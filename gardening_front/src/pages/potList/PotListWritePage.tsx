import PotListWriteForm from "@/features/potList/ui/PotListWriteForm.tsx";

type PotListWritePageProps = {
    mode: "create" | "edit";
};

export default function PotListWritePage({mode}: PotListWritePageProps) {
    return (
        <div className="max-w-6xl mx-auto mt-5 px-4 mb-5">
            <PotListWriteForm mode={mode}/>
        </div>
    );
}
