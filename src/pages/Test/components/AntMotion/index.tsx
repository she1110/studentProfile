import {Parallax} from 'rc-scroll-anim';
import React from 'react';

class Demo extends React.Component {
  render() {
    return (
      <div>
        <Parallax
          animation={{x: 0, opacity: 1, playScale: [0.5, 0.8]}}
          style={{transform: 'translateX(-100px)', opacity: 0}}
          className="code-box-shape"
        />
      </div>
    );
  }
}

export default Demo;
