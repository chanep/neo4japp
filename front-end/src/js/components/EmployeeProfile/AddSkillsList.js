/**
 * Components: AddSkillsList
 */

// Dependencies
import React from 'react';
import { Link } from 'react-router';
import Modal from 'react-modal';
import AddSkillItem from './AddSkillItem';
import SkillsServices from '../../services/SkillsServices';
import BasePage from '../../pages/BasePage';

export default class AddSkillsList extends React.Component {
    constructor(props) {
        super(props);

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.submitSuggestion = this.submitSuggestion.bind(this);

        this.state = {
            selectedGroup: 0,
        	data: []
        };

        this.skillsServices = new SkillsServices();
        this.basePage = new BasePage();
    }

    componentDidMount() {
        this.setState({
            selectedGroup: this.props.selectedGroup,
            data: this.props.data
        });
    }

	componentWillReceiveProps(nextProps) {
        this.setState({
            selectedGroup: nextProps.selectedGroup,
            data: nextProps.data
        });
	}

    openModal () { this.setState({open: true}); }

    closeModal () { this.setState({open: false}); }

    submitSuggestion () {
        var name = document.getElementById('suggestion-name').value.trim(),
            description = document.getElementById('suggestion-description').value.trim();

        if (name != '') {
            this.skillsServices.SuggestSkill(name, description).then(data => {
                this.setState({open: false});
            }).catch(data => {
              
                console.log("skills error", data);
              
            });
        }
    }

    render() {
        let self = this;

        return (
            <div>
                <div className="addSkillsList col -col-9 -col-no-gutter">
                    {this.state.data.length > 0 && this.state.selectedGroup > 0 ?
                        this.state.data.map(function(obj, key) {
                            if (obj.id === self.state.selectedGroup) {
                                return obj.children.map((subgroup, subgroupKey) => 
                                    <AddSkillItem data={subgroup} parent={obj} key={subgroupKey} />
                                )
                            }
                        })
                    :
                        <div className="selectCategory">Please, select a category</div>
                    }
                    {this.basePage.GetCurrentUserType() == 'employee' ?
                        <div onClick={this.openModal} className="suggest"><span>Suggest skill/tool</span></div>
                    : false}
                </div>
                <Modal
                    isOpen={this.state.open}
                    onRequestClose={this.closeModal}
                    className="ModalClass"
                    overlayClassName="OverlayClass">
                    <div className="modal-header">
                        <span className="modal-close ss-icon-close" onClick={this.closeModal}><span className="path1"></span><span className="path2"></span></span>
                    </div>
                    <div className="modal-contents">
                        <h2>Suggest skill/tool</h2>
                        <div>
                            Skill/tool name: <br/>
                            <input id="suggestion-name" />
                        </div>
                        <div>
                            Description: <br/>
                            <textarea id="suggestion-description" />
                        </div>
                        <button onClick={this.submitSuggestion} value="Submit">Submit</button>
                    </div>
                </Modal>
            </div>
        );
    }
}