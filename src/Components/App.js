import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, Container, Row, Col, Navbar, NavbarBrand, Card, CardHeader, CardBody, CardFooter, CardText } from 'reactstrap';
import './App.css';

const uuidv1 = require('uuid/v1');

// This contains funtions for rendering components that change with the state.
function dynamicRenders(changers) {

  let renders = {
    renderCard: (note) => {
      return (
        <div key={note.id}>
          <Card className="helvetica">
            <CardHeader>
              <Row>
                <Col xs={{ size: 11, order: 3 }} sm={{ size: 11, order: 1 }} className="headerFontSize fredoka coolPurple">
                  {note.isBeingEdited ? <Input type="text" id="editTitle" placeholder={note.title} /> : note.title}
                </Col>
                <Col xs={{ size: 4, order: 2 }} sm="1" >
                  {note.isBeingEdited ? 
                  <div>
                    <div className="addButton formLabelFontSize cardButton" onClick={() => changers["submitChange"]({
                       id: note.id, 
                       title: document.getElementById("editTitle").value,
                       body: document.getElementById("editBody").value,
                       created: note.created})}>Save</div>
                    <div className="smallSpacer" />
                    <div className="addButton formLabelFontSize cardButton" onClick={() => changers["cancelEdit"](note)}>Back</div>
                  </div> : 
                  <div>
                    <div className="addButton formLabelFontSize cardButton">Give</div>
                    <div className="smallSpacer" />
                    <div className="addButton formLabelFontSize cardButton" onClick={() => changers["deleteNote"](note.id)}>Del</div>
                    <div className="smallSpacer" />
                    <div className="addButton formLabelFontSize cardButton" onClick={() => changers["editNote"](note)}>Edit</div>
                  </div>}
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              <CardText> {note.isBeingEdited ? <Input type="text" id="editBody" placeholder={note.body} /> : note.body}</CardText>
            </CardBody>
            <CardFooter className="italicized">Created on: {note.created} and Updated: {note.updated}</CardFooter>
          </Card>
          <div className="spacer" />
        </div>
      );
    },

    renderLogin: (token) => {
      if (token == null) {
        return (<div className="notiri_title loginout" onClick={changers["navigateLogin"]}>Login</div>);
      } else {
        return (<div classNAme="notiri_title loginout">Logout</div>);
      }
    },

    renderPeopleListModal: (list) => {

    },

    renderFormCard: () => {
      return (
        <Form>
          <FormGroup>
            <Label />
            <Input type="text" name="title" id="notiriTitle" placeholder="Title" />
            <div className="spacer" />
            <Input type="text" name="body" id="notiriBody" placeholder="Body" />
          </FormGroup>
        </Form>
      )
    },

    renderUndoButton: (currentInHistory) => {
      if (currentInHistory > 0) {
        return (
          <div className="addButton" onClick={() => changers["undoAction"]()}>Undo</div>
        );
      } else {
        return (
          <div className="addButton grayedOut">Undo</div>
        );
      }

    }
  };

  return renders;
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "Captain Kirk",
      token: null,
      notesHistory: [{
        notes: [{
          id: uuidv1(),
          title: 'This is a Note',
          body: 'In the beginning, there was this note.',
          created: getCurrentDate(),
          updated: "",
          isBeingEdited: false
        }]
      }],
      currentUiLayout: 'notesPage',
      currentInHistory: 0,
      otherUsers: [{
        id: uuidv1(),
        username: "Elliot",
      }]
    }

    // All state changing calls are contained in the changers dictionary.
    this.stateChangers = {
      navigateHome: () => {
        this.setState({
          currentUiLayout: "welcomePage"
        });
      },

      login: (username, password) => {

        this.setState({
          currentUiLayout: "notesPage"
        });
      },

      createUser: (username, password) => {

      },

      navigateLogin: () => {
        this.setState({
          currentUiLayout: "loginPage"
        });
      },

      navigateNewUserPage: () => {
        this.setState({
          currentUiLayout: "newUserPage"
        })
      },

      deleteNote: (id) => {
        this.setState({
          notesHistory: this.state.notesHistory.concat([{
            notes: this.state.notesHistory[this.state.notesHistory.length - 1].notes.filter((note) => {
              return note.id !== id;
            })
          }]),
        })
      },

      addNote: (title, body) => {
        this.setState({
          notesHistory: this.state.notesHistory.concat([{
            notes: this.state.notesHistory[this.state.notesHistory.length - 1].notes.concat([{
              id: uuidv1(),
              title: title,
              body: body,
              created: getCurrentDate(),
              updated: "",
              isBeingEdited: false
            }])
          }]),
        })
      },

      undoAction: () => {
        this.setState({
          notesHistory: this.state.notesHistory.filter((element, index, arr) => {
            return index < this.state.notesHistory.length - 1;
          })
        })
      },

      giveNote: () => {
        this.setState({

        })
      },

      editNote: (toEdit) => {
        this.setState({
          notesHistory: this.state.notesHistory.concat([{
            notes: this.state.notesHistory[this.state.notesHistory.length - 1].notes.map((note) => {
              if (note.id === toEdit.id) {
                return {
                  id: note.id,
                  title: note.title,
                  body: note.body,
                  created: note.created,
                  updated: note.updated,
                  isBeingEdited: true
                }
              } else {
                return note;
              }
            })
          }]),
        })
      },

      cancelEdit: (toEdit) => {
        this.setState({
          notesHistory: this.state.notesHistory.concat([{
            notes: this.state.notesHistory[this.state.notesHistory.length - 1].notes.map((note) => {
              if (note.id === toEdit.id) {
                return {
                  id: note.id,
                  title: note.title,
                  body: note.body,
                  created: note.created,
                  updated: note.updated,
                  isBeingEdited: false
                }
              } else {
                return note;
              }
            })
          }]),
        })
      },

      submitChange: (toEdit) => {
        this.setState({
          notesHistory: this.state.notesHistory.concat([{
            notes: this.state.notesHistory[this.state.notesHistory.length - 1].notes.map((note) => {
              if (note.id === toEdit.id) {
                return {
                  id: toEdit.id,
                  title: toEdit.title,
                  body: toEdit.body,
                  created: toEdit.created,
                  updated: getCurrentDate(),
                  isBeingEdited: false
                }
              } else {
                return note;
              }
            })
          }]),
        })
      }
    };

    //dictionary of dynamic component's factories.
    this.renders = dynamicRenders(this.stateChangers);

    // To switch pages, I use a dictionary of all page possibilites.
    this.pages = {
      loginPage: () => {
        return (
          <Container fluid className="containerFluid">
            <Row>
              <Col xs="2">
                <div></div>
              </Col>
              <Col xs="8">
                <Form>
                  <FormGroup>
                    <Label className="fredoka coolPurple formLabelFontSize" for="notiriUsername">Username</Label>
                    <Input type="username" name="username" id="notiriUsername" placeholder="Captain Kirk" />
                  </FormGroup>
                  <FormGroup>
                    <Label className="fredoka coolPurple formLabelFontSize" for="notiriPassword">Password</Label>
                    <Input type="password" name="password" id="notiriPassword" placeholder="12345" />
                  </FormGroup>
                  <div className="addButton" onClick={this.stateChangers["login"]}>Login</div>
                  <div className="spacer" />
                  <div className="addButton" onClick={this.stateChangers["navigateNewUserPage"]}>Register</div>
                </Form>
              </Col>
              <Col xs="2">
                <div></div>
              </Col>
            </Row>
          </Container>
        );
      },

      newUserPage: () => {
        return (
          <Container fluid className="containerFluid">
            <Row>
              <Col xs="2">
                <div></div>
              </Col>
              <Col xs="8">
                <Form>
                  <FormGroup>
                    <Label className="fredoka coolPurple formLabelFontSize" for="notiriUsername">Username</Label>
                    <Input type="username" name="username" id="notiriUsername" placeholder="Captain Kirk" />
                  </FormGroup>
                  <FormGroup>
                    <Label className="fredoka coolPurple formLabelFontSize" for="notiriPassword">Password</Label>
                    <Input type="password" name="password" id="notiriPassword" placeholder="12345" />
                  </FormGroup>
                  <FormGroup>
                    <Label className="fredoka coolPurple formLabelFontSize" for="notiriConfirm">Confirm Password</Label>
                    <Input type="password" name="confirmPassword" id="notiriConfirm" placeholder="00000" />
                  </FormGroup>
                  <div className="addButton">Create</div>
                </Form>
              </Col>
              <Col xs="2">
                <div></div>
              </Col>
            </Row>
          </Container>
        );
      },

      notesPage: () => {
        return (
          <Container fluid className="containerFluid">
            <Row>
              <Col xs="10" sm="2">
                <Row>
                  <Col>
                    <div className="addButton" onClick={() => this.stateChangers["addNote"](document.getElementById("notiriTitle").value, document.getElementById("notiriBody").value)}>Add</div>
                    <div className="spacer"></div>
                  </Col>
                  <Col>
                    {this.renders["renderUndoButton"](this.state.notesHistory.length - 1)}
                  </Col>
                </Row>
              </Col>
              <Col xs="10" sm="10">
                {
                  this.state.notesHistory[this.state.notesHistory.length - 1].notes.map((note) => {
                    return this.renders["renderCard"](note);
                  })
                }
                {this.renders["renderFormCard"]()}
              </Col>
            </Row>
          </Container>
        );
      },

      welcomePage: () => {
        return (
          <div className="hugeFont fredoka coolPurple">
            <Row>
              <Col xs="2"><div></div></Col>
              <Col xs="8" className="centered">Welcome!</Col>
              <Col xs="2"><div></div></Col>
            </Row>
          </div>
        );
      },
    };
  }

  render() {
    return (
      <div>
        <Navbar className="navstuff">
          <NavbarBrand onClick={this.stateChangers["navigateHome"]}><h1 className="notiri_title">Notiri</h1></NavbarBrand>
          {this.renders["renderLogin"](this.state.token)}
        </Navbar>
        <div className="spacer" />
        {this.pages[this.state.currentUiLayout]()}
        <div className="footer">
        </div>
      </div>
    );
  }
}

function getCurrentDate() {
  let date = new Date();
  return date.toLocaleString("en-US");
}

export default App;
