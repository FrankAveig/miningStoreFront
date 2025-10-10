import React from 'react';
import PropTypes from 'prop-types';
import './formSkeleton.scss';

export const FormSkeleton = ({ fieldCount = 2 }) => {
  return (
    <div className="form-skeleton">
      <div className="form-skeleton__fields">
        {[...Array(fieldCount)].map((_, i) => (
          <div className="form-skeleton__field" key={i}>
            <div className="form-skeleton__label-skeleton" />
            <div className="form-skeleton__input-skeleton" />
          </div>
        ))}
      </div>
      <div className="form-skeleton__button-skeleton" />
    </div>
  );
};

FormSkeleton.propTypes = {
  fieldCount: PropTypes.number
}; 