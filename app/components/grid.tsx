type GridProps = {
  children?: React.ReactNode | React.ReactNode[]
}

export default function Grid({ children, ...props }: GridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 place-content-center mt-2">
      {children}
    </div>
  )
}
