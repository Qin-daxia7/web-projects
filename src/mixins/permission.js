import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["roles"]),
  },
  methods: {
    //按钮权限
    havePermissions(points) {
      return this.roles.points.includes(points);
    },
  },
};
