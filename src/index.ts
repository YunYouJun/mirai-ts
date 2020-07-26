import Mirai from "./mirai";

export default Mirai;

if (typeof module !== 'undefined') {
  module.exports = Mirai;
  module.exports.default = Mirai;
  module.exports.Mirai = Mirai;
}
