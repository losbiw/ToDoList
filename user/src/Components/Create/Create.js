import React, { Component } from 'react'
import { ReactComponent as List } from 'assets/Creation/list.svg'
import { ReactComponent as Task } from 'assets/Creation/task.svg'
import { ReactComponent as Add } from 'assets/Creation/add.svg'
import './Create.css'

export default class Create extends Component{
    constructor(props){
        super(props);

        this.state = {
            areOptionsActive: false
        }
    }

    componentDidMount(){
        document.addEventListener('click', this.handleClickOutside);
    }

    componentWillUnmount(){
        document.removeEventListener('click', this.handleClickOutside);
    }

    handleClickOutside = e => {
        const { id } = e.target;

        if(id !== 'add' && id !== 'task' && id !== 'category'){
            this.setState({
                areOptionsActive: false
            })
        }
    }

    handleNewTaskCreation = () => {
        const { handleAppStateChange, tasks, current } = this.props;

        if(!tasks[current]){
            this.handleNewCategoryCreation();
        }

        tasks[current].list.push({
            value: 'New Task',
            key: Math.random()
        });

        handleAppStateChange({ tasks })
    }

    handleNewCategoryCreation = () => {
        const { handleAppStateChange, tasks } = this.props;

        tasks.push({
            category: 'Category',
            deletable: true,
            list: [{
                value: 'New Task',
                key: Math.random()
            }],
            key: Math.random()
        });

        handleAppStateChange({ tasks });
    }

    handleAddClick = () => {
        this.setState({
            areOptionsActive: true
        })
    }

    render(){
        const { handleNewTaskCreation, handleNewCategoryCreation, handleAddClick } = this;
        
        return(
            <div id='create'>
                { this.state.areOptionsActive 
                  ? <div id='options'>
                        <button id='task' onClick={ handleNewTaskCreation }>
                            <Task />
                            Task
                        </button>
                        <button id='category' onClick={ handleNewCategoryCreation }>
                            <List />
                            Category
                        </button>
                    </div>
                  : <button id='add' onClick={ handleAddClick }>
                      <Add />
                    </button>
                }
            </div>
        )
    }
}