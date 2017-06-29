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
import AlertContainer from 'react-alert';

export default class AddSkillsList extends React.Component {
    constructor(props) {
        super(props);

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.submitSuggestion = this.submitSuggestion.bind(this);

        this.state = {
            selectedGroup: 0,
        	data: [],
            failedAttempt: false
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

    closeModal () { this.setState({ 'open': false, 'failedAttempt': false }); }

    submitSuggestion () {
        var name = document.getElementById('suggestion-name').value.trim(),
            description = document.getElementById('suggestion-description').value.trim();

        if (name != '') {
            this.skillsServices.SuggestSkill(name, description).then(data => {
                this.setState({'open': false, 'failedAttempt': false });

                // clean up fields and show success message
                msg.show('Suggestion sent', {
                    time: 3500,
                    type: 'success',
                    icon: <img src="/img/success-ico.png" />
                });
            }).catch(data => {
                console.log("skills error", data);
            });
        } else {
            this.setState({ 'failedAttempt': true });
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
                        <div className="add-skills-information">
                            <p>Start by selecting a category on the left side of this page.</p>

                            <h4>GUIDING PRINCIPLES</h4>
                            <ul>
                                <li>Add the skills that are relevant to your career path. Include the skills you currently have and any skills you want to develop.</li>
                                <li>It is important to set accurate expectations. Don’t rate yourself higher than you are comfortable. You can always update the skill level as you gain more experience.</li>
                            </ul>

                            <h4>SKILL LEVEL DESCRIPTIONS</h4>
                            <p><strong>Want:</strong> You do not have the skill but want to actively learn and apply the skill to your projects.</p>
                            <p><strong>Heavy Supervision:</strong> You have the skill, but have limited experience and require heavy oversight.</p>
                            <p><strong>Light Supervision:</strong> You have the skill, but have some experience where you could still use help.</p>
                            <p><strong>No Supervision:</strong> You have the skill and significant experience utilizing it in a work setting.</p>
                            <p><strong>Teach/Manage:</strong> You have the skill and have experience teaching or managing teams delivering the work.</p>

                        </div>
                    }
                    <div onClick={this.openModal} className="suggest"><span>Suggest skill/tool &#43;</span></div>
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
                        {this.state.failedAttempt ?
                            <span className="failed-attempt">Skill/name cannot be empty.</span>
                        : false}
                        <button onClick={this.submitSuggestion} value="Submit">Submit</button>
                    </div>
                </Modal>
            </div>
        );
    }
}
