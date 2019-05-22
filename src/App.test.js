import React from 'react';
import ReactDOM from 'react-dom';
import Pick from './js_files/Pick';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Pick />, div);
  ReactDOM.unmountComponentAtNode(div);
});
