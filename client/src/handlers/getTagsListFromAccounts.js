export default (array) => {
    return array
        .map(item => {
            return item.operations
        })
        .flat()
        .map(operation => {
            return operation.tags
        })
        .flat()
        .sort((a, b) => a.localeCompare(b))
        .reduce((prev, curr) => {
            if (prev[prev.length - 1] === curr) {
                return [...prev]
            } else {
                return [...prev, curr]
            }
        }, [])
}