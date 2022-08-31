function LinkItem(props) {
    return (
        <div>
            <p>LinkItem</p>
            <p><span>name: </span>{props.item.name}</p>
            <p><span>url: </span>{props.item.url}</p>
            <p><span>description: </span>{props.item.description}</p>
        </div>
    )
}

export default LinkItem;