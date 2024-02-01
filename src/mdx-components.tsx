import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="mt-2 scroll-m-20 text-4xl font-bold tracking-tight">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="mt-10 scroll-m-20 border-b pb-1 text-3xl font-semibold tracking-tight first:mt-0">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-8 scroll-m-20 text-xl font-semibold tracking-tight">
        {children}
      </h4>
    ),
    h5: ({ children }) => (
      <h5 className="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">
        {children}
      </h5>
    ),
    h6: ({ children }) => (
      <h6 className="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">
        {children}
      </h6>
    ),
    a: ({ children }) => (
      <a className="font-medium underline underline-offset-4">{children}</a>
    ),
    p: ({ children }) => (
      <p className="leading-7 [&:not(:first-child)]:mt-6">{children}</p>
    ),
    ul: ({ children }) => <ul className="my-6 ml-6 list-disc">{children}</ul>,
    ol: ({ children }) => (
      <ol className="my-6 ml-6 list-decimal">{children}</ol>
    ),
    li: ({ children }) => <li className="mt-2">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="mt-6 border-l-2 pl-6 italic [&>*]:text-muted-foreground">
        {children}
      </blockquote>
    ),
    img: ({ children }) => <img className="rounded-md border">{children}</img>,
    hr: ({ children }) => <hr className="my-4 md:my-8">{children}</hr>,
    table: ({ children }) => (
      <table className="my-6 w-full overflow-y-auto">{children}</table>
    ),
    tr: ({ children }) => (
      <tr className="my-6 w-full overflow-y-auto">{children}</tr>
    ),
    th: ({ children }) => (
      <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
        {children}
      </td>
    ),
    pre: ({ children }) => (
      <pre className="mb-4 mt-6 overflow-x-auto rounded-lg border bg-black py-4">
        {children}
      </pre>
    ),

    // code: ({ className, ...props }) => (
    //   <code
    //     className={cn(
    //       "relative rounded border px-[0.3rem] py-[0.2rem] font-mono text-sm",
    //       className,
    //     )}
    //     {...props}
    //   />
    // ),
    // Image,
    // Callout,
    // Card: MdxCard,
    ...components,
  };
}
