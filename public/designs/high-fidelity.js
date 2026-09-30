import {DCLogic,mount} from './runtime.js';
// Preview storage is memory only and cannot access live submissions.
const memory=new Map(); const localStorage={getItem:k=>memory.get(k),setItem:(k,v)=>memory.set(k,v)};

class Component extends DCLogic {
  state = { rate: 60 };

  money(n, step) {
    const r = Math.round(n / step) * step;
    return '$' + r.toLocaleString('en-US');
  }

  renderVals() {
    const hoursLow = 9, hoursHigh = 13;
    const rate = this.state.rate;
    const setRate = (e) => this.setState({ rate: Number(e.target.value) });
    return {
      rate,
      setRate,
      rateLabel: '$' + rate,
      monthlyRange: this.money(hoursLow * rate * 4.3, 50) + ' to ' + this.money(hoursHigh * rate * 4.3, 50),
      annualRange: this.money(hoursLow * rate * 52, 100) + ' to ' + this.money(hoursHigh * rate * 52, 100),
    };
  }
}

mount(Component,"high-fidelity");
