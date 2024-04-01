import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';

function TestC(props) {
  // console.log(props);

  const { h } = props;
  return (
    <>
      <p>TestC:</p>
      {h}
    </>
  );
}

TestC.propTypes = {
  h: PropTypes.string,
};

TestC.defaultProps = {
  h: '',
};

export default TestC;
