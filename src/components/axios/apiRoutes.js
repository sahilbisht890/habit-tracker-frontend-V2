const endpoints = {
    login: '/auth/login',
    register: '/auth/signup',
    refreshToken: '/auth/refresh-token',
    logout: '/auth/logout',
    updateMode: '/auth/update-mode',

    checkAuthentication : '/auth/check-auth',
    sendVerificationOtp: '/auth/send-verification-otp',
    verifyEmail: '/auth/verify-email',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    createNewHabit : '/user/habit/create',
    deleteUserHabit:'/user/habit/delete',
    updateHabit:'/user/habit/update',
    userHabitList : '/user/habit/list',
    
    addNewHabitToTrack:'/user/habit/tracker/add',
    habitTrackerList : '/user/habit/tracker/listByDate',
    updateHabitProgress : '/user/habit/tracker/update',
    deleteHabitFromTracker : '/user/habit/tracker/delete'
  };
  
  export default endpoints;
