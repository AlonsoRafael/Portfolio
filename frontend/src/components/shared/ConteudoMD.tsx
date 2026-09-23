import Markdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import remarkGfm from "remark-gfm"

export interface ConteudoMDProps {
	markdown: string
}

export default function ConteudoMD(props: ConteudoMDProps) {
	return (
		<Markdown
			remarkPlugins={[remarkGfm]}
			rehypePlugins={[rehypeRaw]}
			skipHtml={false}
			components={{
				a: ({ href, children, ...rest }) => (
					<a
						href={href}
						{...rest}
						target="_blank"
						rel="noopener noreferrer"
						className="text-cyan-400 font-semibold underline underline-offset-4 decoration-cyan-400/60 hover:text-cyan-300 hover:decoration-cyan-300 transition-colors inline-block cursor-pointer"
					>
						{children}
					</a>
				),
			}}
		>
			{props.markdown}
		</Markdown>
	)
}
