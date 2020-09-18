export default  class TimerView extends React.Component {
    constructor(props, context) {
      super(props, context);
      this.secondsElapsed = props.secondsElapsed;
      this.msg = "超时警告：";
    }
   
    tick() {
      if(this.secondsElapsed <= 0){
        return;
      }
      this.secondsElapsed = this.secondsElapsed - 10;
      this.setState(this.state);
    }
   
    componentDidMount() {
      this.interval = setInterval(() => this.tick(), 10000);
    }

    componentWillReceiveProps(nextProps) {
        this.secondsElapsed = nextProps.secondsElapsed;
        this.setState(this.state);
    }
   
    componentWillUnmount() {
      clearInterval(this.interval);
    }
   
    render() {
      let message = "";
      if(this.secondsElapsed > 0){
        message = this.msg + this.secondsElapsed;
      }
      return (
        <div>{message}</div>
      );
    }
  }