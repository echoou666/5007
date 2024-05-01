import React, { createContext } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// pages, components, styles
import Nav from "./components/Nav";
import Container from "./styles/Container";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Browse from "./pages/Browse";
import DetailedQuestion from "./pages/DetailedQuestion";
import EditProfile from "./pages/EditProfile";
import Quiz from "./pages/Quiz";
import Study from "./pages/Study";
import { EventEmitter } from 'events'

window.eventBus = new EventEmitter();

const Routing = () => {
    return (
        <Router>
            <Nav />
            <Container>
                <Switch>
                    <Route path="/browse" component={Browse} />
                    <Route path="/quiz" component={Quiz} />
                    <Route path="/p/:questionId" component={DetailedQuestion} />
                    <Route path="/study" component={Study} />
                    <Route path="/accounts/edit" component={EditProfile} />
                    <Route path="/:username" component={Profile} />
                    <Route path="/" component={Home} />
                </Switch>
            </Container>
        </Router>
    );
};

export default Routing;