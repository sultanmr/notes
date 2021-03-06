

import React from 'react';
 import {createContainer} from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';
import {Session} from 'meteor/session';

import PropTypes from 'prop-types';

import {Notes} from '../api/notes';

export  class Editor extends React.Component {
  
    constructor (props) {
        super (props);
        this.state = {
            title: '',
            body: ''
        };
    }

    handleBodyChange (e) {
         const body = e.target.value;
          this.setState ({body});
         this.props.call('notes.update', this.props.note._id, {body});
     }

    handleTitleChange (e) {
        const title = e.target.value;
        this.setState ({title});
        this.props.call('notes.update', this.props.note._id, {title});
    }

    componentDidUpdate (prevProps, prevState) {
        const currentNoteId = this.props.note ? this.props.note._id : undefined;
        const prevNoteId = prevProps.note ? prevProps.note._id: undefined;

        if (currentNoteId && currentNoteId!=prevNoteId) {
            this.setState ( {
                title: this.props.note.title,
                body: this.props.note.body
            })
        }
    }

    handleRemoval() {
        this.props.call('notes.remove', this.props.note._id);
       // window.history.go('/dashboard');
    }


    render () {
        if (this.props.note) {
            return (
                <div className="editor">
                <input className="editor__title" value={this.state.title} placeholder="Untitled Note" onChange={this.handleTitleChange.bind(this)}/>
                <textarea className="editor__body"  value={this.state.body} placeholder="note body here..." onChange={this.handleBodyChange.bind(this)}>
                </textarea>
                <div ><button  className="button button--secondary" onClick={this.handleRemoval.bind(this)}>Delete Note</button></div>
                </div>
            );
        }
        //  else if (this.props.selectedNoteId) {
        //     return (<p>Note not found</p>);
        // } 
        
        return (<p  className="editor__message">Pick or create a note to get started</p>);   
    }

}

Editor.propTypes = {
    note: PropTypes.object,
    selectedNoteId: PropTypes.string
}


export default createContainer (()=>{
    const selectedNoteId = Session.get('selectedNoteId');
    return {
        selectedNoteId,
        note: Notes.findOne (selectedNoteId),
        call: Meteor.call
    }
}, Editor);