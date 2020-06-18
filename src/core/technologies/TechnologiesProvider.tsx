import React from 'react';

import { getTechnologies } from 'api';

import { TechnologiesProviderState, TechnologiesContext, INIT_STATE } from '.';

class TechnologiesProvider extends React.Component<any, TechnologiesProviderState> {
  componentDidMount() {
    this.getTechnologies();
  }

  getTechnologies = async () => {
    const { loading } = this.state;

    if (!loading) {
      this.setState({ ...INIT_STATE, loading: true });
    }

    try {
      const technologies = await getTechnologies();
      this.setState({ ...INIT_STATE, loading: false, technologies });
    } catch (error) {
      this.setState({ ...INIT_STATE, loading: false, error });
    }
  };

  readonly state: TechnologiesProviderState = {
    ...INIT_STATE
  };

  render() {
    return (
      <TechnologiesContext.Provider value={this.state}>
        {this.props.children}
      </TechnologiesContext.Provider>
    );
  }
}

export default TechnologiesProvider;