(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['UserService', '$rootScope'];
    function HomeController(UserService, $rootScope) {
        var vm = this;

        vm.user = null;
        vm.allUsers = [];
        vm.deleteUser = deleteUser;
        vm.getHash = getHash;

        initController();

        function initController() {
            loadCurrentUser();
            loadAllUsers();
        }

        function loadCurrentUser() {
            UserService.GetByUsername($rootScope.globals.currentUser.username)
                .then(function (user) {
                    vm.user = user;
                });
        }

        function loadAllUsers() {
            UserService.GetAll()
                .then(function (users) {
                    vm.allUsers = users;
                });
        }

        function deleteUser(id) {
            UserService.Delete(id)
            .then(function () {
                loadAllUsers();
            });
        }

        function getHash(str)
        {
            if(str.length > 255)
                alert('Max length cannot be > 255');
           vm.hashedData = hashCode(str, 8);
        }
        function toHex(_this) {
            var ret = ((_this<0?0x8:0)+((_this >> 28) & 0x7)).toString(16) + (_this & 0xfffffff).toString(16);
            while (ret.length < 8) ret = '0'+ret;
            return ret;
        };
        function hashCode(o, l) {
            l = l || 2;
            var i, c, r = [];
            for (i=0; i<l; i++)
                r.push(i*268803292);
            function stringify(o) {
                var i,r;
                if (o === null) return 'n';
                if (o === true) return 't';
                if (o === false) return 'f';
                if (o instanceof Date) return 'd:'+(0+o);
                i=typeof o;
                if (i === 'string') return 's:'+o.replace(/([\\\\;])/g,'\\$1');
                if (i === 'number') return 'n:'+o;
                if (o instanceof Function) return 'm:'+o.toString().replace(/([\\\\;])/g,'\\$1');
                if (o instanceof Array) {
                    r=[];
                    for (i=0; i<o.length; i++) 
                        r.push(stringify(o[i]));
                    return 'a:'+r.join(';');
                }
                r=[];
                for (i in o) {
                    r.push(i+':'+stringify(o[i]))
                }
                return 'o:'+r.join(';');
            }
            o = stringify(o);
            for (i=0; i<o.length; i++) {
                for (c=0; c<r.length; c++) {
                    r[c] = (r[c] << 13)-(r[c] >> 19);
                    r[c] += o.charCodeAt(i) << (r[c] % 24);
                    r[c] = r[c] & r[c];
                }
            }
            for (i=0; i<r.length; i++) {
                r[i] = toHex(r[i]);
            }
            return r.join('');
        }
    }

})();