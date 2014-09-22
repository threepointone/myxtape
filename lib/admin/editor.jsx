/**
 * @jsx React.DOM
 */

var React = require('react/addons'),
  Fluxxor = require('fluxxor'),
  JSDiff = require('diff'),
  FluxMixin = Fluxxor.FluxMixin(React), // or window.React, etc.
  FluxChildMixin = Fluxxor.FluxChildMixin(React),
  StoreWatchMixin = Fluxxor.StoreWatchMixin;

  content = require('../content'),
  _ = require('underscore');

var Editor = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin('collection')],

  getStateFromFlux: function(){
    return {collection:this.getFlux().store('collection').get()};
  },

  setKey: function(e){
    this.setState({
      key: e.target.value||''
    });
    this.getFlux().actions['key:set'](e.target.value||'');
  },

  setLayout: function(e){
    this.setState({
      layout: e.target.value||''
    });
    this.getFlux().actions['layout:set'](e.target.value||'');
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    var t = this;
    return _(_.keys(nextState.collection)).reduce(function(bool, k){
      return bool || (nextState.collection[k] !== t.state.collection[k]);
    }, false);     
  },

  canSave: function(){
    return this.state.collection.dirty && (this.state.collection.key||'').trim() && !this.state.collection.saving;
  },


  render: function(){
  var t = this;
    var errors = _(['keysErrs', 'layoutErrs', 'toJSONErrs', 'savingErrs']).reduce(function(arr, key){
      return arr.concat(t.state.collection[key] || []);
    }, []);
  

    return <div className='editor pure-g'>
      <form className='canvas pure-form pure-u-2-3 box'>        
        
        <input list='keys'  ref='key' type='text' value={this.state.collection.key} onChange={this.setKey}/>
        <datalist id='keys'>
          {_(this.state.collection.keys).map(function(key){ return <option value={key}/> })}
        </datalist>
        
        <button style={{float:'right'}} className='save pure-button button-secondary' onClick={this.doSave} disabled={!this.canSave() || (errors.length>0)}>
          <i className='fa fa-save'></i>
          {this.state.collection.saving ? 'saving' : 'save'}
        </button> 
        
        <div className='mirror-cnt'>
          <textarea ref='textarea' className='layout pure-u-1' value={this.state.collection.layout} onChange={this.setLayout}/>
        </div>        
        {errors.length>0?<Errors errors={errors}/>:null}
        <Diff before={this.state.collection.originalLayout} after={this.state.collection.layout}/>
      
      </form>   
      <Preview compiled={this.state.collection.obj} components={this.props.components}/> 
    </div>      
  },
  doSave: function(e){
    e && e.preventDefault();
    this.getFlux().actions['layout:save'](this.state.collection.key, this.state.collection.layout);
  }
  
  
});

var Preview = React.createClass({
  render: function(){
    return <div className='preview pure-u-1-3 box'>
      {content.toComponent(this.props.compiled, {components: this.props.components})}
    </div>
  }
});

var Diff = React.createClass({
  render: function(){
    var diff = JSDiff.diffLines(this.props.before, this.props.after);

    // var patch = JSDiff.createPatch('', this.props.before, this.props.after); // for a straight diff
    return <div className='diff'>
      {_(diff).map(function(part, i){ 
        if(part.added || part.removed){
          return <div style={{color: part.added ? 'green' : 'red' }}> {part.value} </div> 
        }
        return null
      }) }
    </div>
  }
});


var Errors = React.createClass({
  render: function(){
    return <div className='errors'>
      {_.map(this.props.errors, function(error){ 
        var msg = error.message || JSON.stringify(error) || 'unexpected error';
        return <div key ={msg.slice(1, 8)}> {msg} </div>  
      })}
    </div>
  }
});

module.exports = Editor;