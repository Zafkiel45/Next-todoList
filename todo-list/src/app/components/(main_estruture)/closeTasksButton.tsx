interface TypeOfProps {
    toggleSideBarFunctionReverse: () => void;
}

export const CloseTasksButton = ({toggleSideBarFunctionReverse}:TypeOfProps) => {
    return (
        <div onClick={toggleSideBarFunctionReverse} className={`px-2 border-r justify-center border-r-gray-300 dark:border-r-zinc-800 w-[10vw] tablet:hidden bg-gray-200 dark:bg-zinc-900 h-screen flex items-center`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi fill-zinc-500 bi-arrow-right" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
            </svg>
        </div>
    )
}