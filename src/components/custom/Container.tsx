function Container({ children, position = 'center' }: { children: React.ReactNode, position?: 'start' | 'center' | 'end' }) {
    return (
        <div className={`w-full flex justify-${position}`}>
            <div className="w-full max-w-[1200px] p-4">{children}</div>
        </div>
    );
}

export default Container;