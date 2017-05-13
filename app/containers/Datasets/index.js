/*
 *
 * Datasets
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import makeSelectDatasets from './selectors';
import messages from './messages';
import DataChild from './dataChilds.js';
import * as firebase from 'firebase';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import './datasets.css';

export class Datasets extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      msnsets: [],
      loading: true,
    }
  }

  componentDidMount(){
    var msnsets = [];
    firebase.database().ref('meta').orderByChild('tissue').on("child_added", (snapshot) => {
          let set = snapshot.val();
          // console.log(set,'snapshot.val()');
          msnsets.push({
            id: snapshot.getKey(),
            Description: set.Description,
            author: set.author,
            contact: set.contact,
            email: set.email,
            lab: set.lab,
            operator: set.operator,
            species: set.species,
            tissue: set.tissue,
            title:set.title,
            varName: set.varName,
          });
    });
    this.setState({
      msnsets : msnsets
    });
    this.setState({
      loading : false
    });
  }

  render() {

    const DataSetItem = this.state.msnsets.map((detail)=>
     <DataChild key={'dataChild'+detail.id} item={detail} />
    );

    const loader =  <div className="loader">
                        <p> fetching dataset </p>
                        <Spinner size={SpinnerSize.large} />
                    </div>;

    const flexTiles = <div className="flexTiles"> {DataSetItem} </div>;
    const itemContainer = this.state.loading == true ? loader : flexTiles;

    return (
      <div>
        <Helmet
          title="Datasets"
          meta={[
            { name: 'description', content: 'Description of Datasets' },
          ]}
        />
        {itemContainer}
      </div>
    );
  }
}

Datasets.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  Datasets: makeSelectDatasets(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Datasets);