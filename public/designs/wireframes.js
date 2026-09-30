import {DCLogic,mount} from './runtime.js';
// Preview storage is memory only and cannot access live submissions.
const memory=new Map(); const localStorage={getItem:k=>memory.get(k),setItem:(k,v)=>memory.set(k,v)};

class Component extends DCLogic {
  state = { rate: 50 };
  renderVals() {
    const rate = this.state.rate;
    const hoursLow = 7, hoursHigh = 11;
    const r50 = n => Math.round(n / 50) * 50;
    const r100 = n => Math.round(n / 100) * 100;
    const f = n => n.toLocaleString('en-US');
    const ml = r50(hoursLow * rate * 4.3);
    const mh = r50(hoursHigh * rate * 4.3);
    const al = r100(hoursLow * rate * 52);
    const ah = r100(hoursHigh * rate * 52);
    return {
      rate,
      rateLabel: '$' + rate + '/hr',
      monthlyRange: '$' + f(ml) + ' \u2013 $' + f(mh),
      annualRange: '$' + f(al) + ' to $' + f(ah),
      setRate: e => this.setState({ rate: Number(e.target.value) }),
    };
  }
}

mount(Component,"wireframes");
