import {HashRouter , Route , Redirect } from "react-router-dom"

import Login from './view/login/Login'
import Main from './view/main/Index'


function App() {
  return (
      <div>
          <HashRouter >
              <Route path="/login" component={Login}/>
              <Route path="/main" component={Main}/>
              <Route exact path="/" render={() => <Redirect to="/login" push />} />
          </HashRouter >
      </div>
  );
}

export default App;
