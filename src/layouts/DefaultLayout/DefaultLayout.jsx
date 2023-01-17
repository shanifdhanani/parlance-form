import "./DefaultLayout.css"

const DefaultLayout = ({page: Component, ...rest}) => {
    return <div className={"default-layout"} role={"application"}>
        <Component {...rest} />
    </div>
}

export default DefaultLayout;