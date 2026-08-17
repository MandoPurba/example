type ItemRowProps = {
    itemsPerPage: number;
    setItemsPerPage: (items: number) => void;
};

export const ItemRow = ({ itemsPerPage, setItemsPerPage }: ItemRowProps) => {
    return (
        <div className="flex items-center gap-4">

            <p className="text-sm text-gray-500">
                Showing {itemsPerPage} per page
            </p>

            <select
                className="border rounded-md px-2 py-1 text-sm"
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
            </select>
        </div>

    )
}
