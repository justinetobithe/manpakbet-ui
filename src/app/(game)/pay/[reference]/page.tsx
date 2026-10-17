import DepositCheckout from "@/components/account/DepositCheckout";

export const metadata = { title: "Complete your payment" };

export default async function PayPage({ params }: { params: Promise<{ reference: string }> }) {
    const { reference } = await params;
    return <DepositCheckout reference={reference} />;
}
