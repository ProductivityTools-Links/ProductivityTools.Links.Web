import React, { useEffect, useState } from 'react'

import './ContextMenu.css'

const ContextMenu = ({ parentRef, items }) => {

    const [isVisible, setIsVisible] = useState(false);
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [selectedTreeId, setSelectedTreeId] = useState();

    useEffect(() => {
        const parent = parentRef.current;
        if (!parent) {
            return;
        }

        //console.log(parentRef);

        const showMenu = (event, x) => {
            console.log("event")
            console.log(event);
            console.log(x);
            event.preventDefault();

            setIsVisible(true);
            setX(event.clientX);
            setY(event.clientY);
            console.log('show');
            console.log(event.composedPath())
            let elementId = event.composedPath().find(e => e.nodeName === 'LI').getAttribute('contextmenuid');
            var element = event.composedPath().find(e => e.nodeName === 'BUTTON');
            console.log("element", element);
            element.click();
            setSelectedTreeId(parseInt(elementId));
            console.log("selectet tree id")
            console.log(elementId);

        }

        const closeMenu = () => {
            setIsVisible(false);
        }

        parent.addEventListener('contextmenu', showMenu);
        window.addEventListener('click', closeMenu);

        return function cleanup() {
            parent.removeEventListener('contextmenu', showMenu);
            parent.removeEventListener('click', closeMenu);
        }
    })

    const style = {
        top: y,
        left: x
    };


    return isVisible ? (
        <div className='context-menu' style={style}>
            {items.map((item, index) => {
                return (
                    <div key={index}
                        onClick={() => { item.onclick(selectedTreeId) }}
                        className='context-menuItem'>
                        {item.text}
                    </div>
                )
            })}
        </div>
    ) : null
}

export default ContextMenu;