export default function (route) {
  this.$parent.$parent.activeLink = route
  this.$router.push(route)
}
