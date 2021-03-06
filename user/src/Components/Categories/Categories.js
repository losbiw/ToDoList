import React, { Component, createRef } from 'react'
import ContextMenu from '../ContextMenu/ContextMenu'
import Category from '../Category/Category'
import { Container } from 'react-smooth-dnd'
import areEqual from 'modules/areEqual'
import './Categories.css'

export default class Categories extends Component{
    constructor(props){
        super(props);

        this.state = {
            contextMenu: undefined,
            activeIndex: undefined,
            menuIndex: undefined,
            isLeave: false
        }

        this.listRef = createRef(null);
    }

    componentDidMount(){
        document.addEventListener('click', this.handleClickOutside);
        this.componentDidUpdate();
    }

    componentWillUnmount(){
        document.removeEventListener('click', this.handleClickOutside);
    }

    componentDidUpdate(prevProps){
        const { listRef, props } = this;
        const { current } = listRef;
        const size = prevProps?.size;

        if(current && ((size && !areEqual(size, props.size)) || props.size)){
            const { clientWidth, scrollWidth } = current;
            current.className = '';
            
            if(scrollWidth > clientWidth){
                current.className = 'margin-bottom';
            }
        }
    }

    handleClickOutside = e => {
        const { activeIndex, contextMenu } = this.state;
        const { id, dataset } = e.target;

        if(contextMenu && id !== 'context'){
            this.setState({
                contextMenu: undefined
            })
        }

        if(dataset.index !== activeIndex && id !== 'Rename'){
            this.setState({
                activeIndex: undefined
            })
        }
    }

    handleStateChange = data => {
        this.setState(data)
    }

    handleDrop = result => {
        const { tasks, handleAppStateChange, current } = this.props;
        const { removedIndex, addedIndex } = result;

        const dragged = tasks[removedIndex];
        const { key } = tasks[current];

        tasks.splice(removedIndex, 1);
        tasks.splice(addedIndex, 0, dragged);

        const updatedIndex = tasks.findIndex(category => category.key === key);

        handleAppStateChange({ 
            tasks,
            currentGroupIndex: updatedIndex
        });

        this.setState({
            contextMenu: undefined
        });
    }

    handleDragEnd = result => {
        if(this.state.isLeave){
            this.setState({
                menuIndex: result.payload,
                isLeave: false
            })
        }
    }

    handleDragLeave = () => {
        this.setState({
            isLeave: true
        })
    }

    render(){
        const { handleDrop, handleDragEnd, handleDragLeave, listRef, handleStateChange } = this;
        const { tasks, size, current, handleAppStateChange, handleCategoryDelete } = this.props;
        const { contextMenu, activeIndex, menuIndex } = this.state;

        return(
            <div id='categories' ref={ listRef }>
                <Container orientation='horizontal'
                           onDrop={ handleDrop }
                           onDragLeave={ handleDragLeave }
                           onDragEnd={ handleDragEnd }
                           getChildPayload={ index => index }
                >
                    {
                        tasks.map((task, index) => {
                            const { category, key } = task;

                            const categoryProps = {
                                handlers: {
                                    handleStateChange,
                                    handleAppStateChange,
                                    handleCategoryDelete
                                },
                                data: {
                                    task,
                                    index,
                                    category,
                                    current,
                                    size,
                                    tasks,
                                    activeIndex,
                                    menuIndex,
                                    dragKey: key
                                }
                            }
                            
                            return <Category { ...categoryProps }
                                            key={ key } /> 
                        })
                    }
                </Container>

                { contextMenu && <ContextMenu data={ contextMenu }/> }
            </div>
        )
    }
}