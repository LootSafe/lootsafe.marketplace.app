export default function () {
  localStorage.setItem('tour-opt-out', 'false')
  this.$router.push('/')
  this.$parent.restartTour()
}
