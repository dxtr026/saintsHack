import React from 'react';
const { describe, it, __base } = global;
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { expect } from 'chai';

import ImageCard from '../../src/components/commonComponents/imageCard'

describe('ImageCard Component', () => {
  it('should call onClick on clicking on the component', () => {
    const onClick = sinon.spy();

    const wrapper = shallow(
      <ImageCard
        className={'test-1'}
        onClick={onClick}
        image='https://abc.png'
      />
    );

    wrapper.find('.ic').simulate('click');

    expect(onClick.calledOnce).to.equal(true);
  });

  it('should not call render if the image in newProps is same as previous', () => {
    const spy = sinon.spy(ImageCard.prototype, 'render');

    const wrapper = shallow(
      <ImageCard
        className={'test-1'}
        image='https://abc.png'
      />
    );

    expect(spy.calledOnce).to.equal(true);

    wrapper.setProps({
      image: 'https://abc.png'
    });

    expect(spy.calledTwice).to.equal(false);

    wrapper.setProps({
      image: 'https://abc1.png'
    });

    expect(spy.calledTwice).to.equal(true);
  });
});
