import GameEditor from "@/components/admin/GameEditor";

type Props = { params: Promise<{ id: string }> };

export default async function EditGamePage({ params }: Props) {
    const { id } = await params;
    return <GameEditor id={Number(id)} />;
}
