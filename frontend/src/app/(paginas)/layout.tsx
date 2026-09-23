import BotaoChat from "@/components/chat/BotaoChat"

export default function Layout(props: { children: React.ReactNode }) {
	return (
		<div className="relative min-h-screen">
			{props.children}
			<BotaoChat />
		</div>
	)
}