jQuery(function ($) {
    "use strict"
    $.fn.bravoAutocomplete = function (options) {
        return this.each(function () {
            var $this = $(this);
            var main = $(this).closest(".smart-search");
            var textLoading = options.textLoading;
            main.append('<div class="bravo-autocomplete on-message"><div class="list-item"></div><div class="message">'+textLoading+'</div></div>');
            $(document).on("click.Bst", function(event){
                if (main.has(event.target).length === 0 && !main.is(event.target)) {
                    main.find('.bravo-autocomplete').removeClass('show');
                } else {
                    if (options.dataDefault.length > 0) {
                        main.find('.bravo-autocomplete').addClass('show');
                    }
                }
            });
            if (options.dataDefault.length > 0) {
                var items = '';
                for (var index in options.dataDefault) {
                    var item = options.dataDefault[index];
                    items += '<div class="item" data-id="' + item.id + '" data-text="' + item.title + '"> <i class="'+options.iconItem+'"></i> ' + item.title + ' </div>';
                }
                main.find('.bravo-autocomplete .list-item').html(items);
                main.find('.bravo-autocomplete').removeClass("on-message");
            }
            var requestTimeLimit;
            if(typeof options.url !='undefined' && options.url) {
                $this.on('keyup',function () {
                    main.find('.bravo-autocomplete').addClass("on-message");
                    main.find('.bravo-autocomplete .message').html(textLoading);
                    main.find('.child_id').val("");
                    var query = $(this).val();
                    clearTimeout(requestTimeLimit);
                    if (query.length === 0) {
                        if (options.dataDefault.length > 0) {
                            var items = '';
                            for (var index in options.dataDefault) {
                                var item = options.dataDefault[index];
                                items += '<div class="item" data-id="' + item.id + '" data-text="' + item.title + '"> <i class="' + options.iconItem + '"></i> ' + item.title + ' </div>';
                            }
                            main.find('.bravo-autocomplete .list-item').html(items);
                            main.find('.bravo-autocomplete').removeClass("on-message");
                        } else {
                            main.find('.bravo-autocomplete').removeClass('show');
                        }
                        return;
                    }
                    requestTimeLimit = setTimeout(function () {
                        $.ajax({
                            url: options.url,
                            data: {
                                search: query,
                            },
                            dataType: 'json',
                            type: 'get',
                            beforeSend: function () {
                            },
                            success: function (res) {
                                if (res.status === 1) {
                                    var items = '';
                                    for (var ix in res.data) {
                                        var item = res.data[ix];
                                        items += '<div class="item" data-id="' + item.id + '" data-text="' + item.title + '"> <i class="' + options.iconItem + '"></i> ' + get_highlight(item.title, query) + ' </div>';
                                    }
                                    main.find('.bravo-autocomplete .list-item').html(items);
                                    main.find('.bravo-autocomplete').removeClass("on-message");
                                }
                                if ( typeof res.message === undefined) {
                                    main.find('.bravo-autocomplete').addClass("on-message");
                                }else{
                                    main.find('.bravo-autocomplete .message').html(res.message);
                                }
                            }
                        })
                    }, 700);

                    function get_highlight(text, val) {
                        return text.replace(
                            new RegExp(val + '(?!([^<]+)?>)', 'gi'),
                            '<span class="h-line">$&</span>'
                        );
                    }

                    main.find('.bravo-autocomplete').addClass('show');
                });
            }
            main.find('.bravo-autocomplete').on('click','.item',function () {
                var id = $(this).attr('data-id'),
                    text = $(this).attr('data-text');
                if(id.length > 0 && text.length > 0){
                    text = text.replace(/-/g, "");
                    text = trimFunc(text,' ');
                    text = trimFunc(text,'-');
                    main.find('.parent_text').val(text).trigger("change");
                    main.find('.child_id').val(id).trigger("change");
                }else{
                    console.log("Cannot select!")
                }
                setTimeout(function () {
                    main.find('.bravo-autocomplete').removeClass('show');
                },100);
            });

            var trimFunc = function (s, c) {
                if (c === "]") c = "\\]";
                if (c === "\\") c = "\\\\";
                return s.replace(new RegExp(
                    "^[" + c + "]+|[" + c + "]+$", "g"
                ), "");
            }
        });
    };
});

jQuery(function ($) {
    "use strict"
    function parseErrorMessage(e){
        var html = '';
        if(e.responseJSON){
            if(e.responseJSON.errors){
                return Object.values(e.responseJSON.errors).join('<br>');
            }
        }
        return html;
    }

    //Login
    $('.bravo-form-login [type=submit]').on('click',function (e) {
        e.preventDefault();
        let form = $(this).closest('.bravo-form-login');
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': form.find('input[name="_token"]').val()
            }
        });
        $.ajax({
            'url': extraStaff.routes.login,
            'data': {
                'email': form.find('input[name=email]').val(),
                'password': form.find('input[name=password]').val(),
                'remember': form.find('input[name=remember]').is(":checked") ? 1 : '',
                'g-recaptcha-response': form.find('[name=g-recaptcha-response]').val(),
                'redirect':form.find('input[name=redirect]').val()
            },
            'type': 'POST',
            beforeSend: function () {
                form.find('.error').hide();
                form.find('.icon-loading').css("display", 'inline-block');
            },
            success: function (data) {
                form.find('.icon-loading').hide();
                if (data.error === true) {
                    if (data.messages !== undefined) {
                        for(var item in data.messages) {
                            var msg = data.messages[item];
                            form.find('.error-'+item).show().text(msg[0]);
                        }
                    }
                    if (data.messages.message_error !== undefined) {
                        form.find('.message-error').show().html('<div class="alert alert-danger">' + data.messages.message_error[0] + '</div>');
                    }

                }
                if (typeof data.redirect !== 'undefined' && data.redirect) {
                    window.location.href = data.redirect
                }
            }
        });
    })
    $('.bravo-form-register [type=submit]').on('click',function (e) {
        e.preventDefault();
        let form = $(this).closest('.bravo-form-register');
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': form.find('input[name="_token"]').val()
            }
        });
        $.ajax({
            'url':  extraStaff.routes.register,
            'data': {
                'email': form.find('input[name=email]').val(),
                'password': form.find('input[name=password]').val(),
                'password_confirmation' : form.find('input[name=password_confirmation]').val(),
                'type': form.find('input[name=type]:checked').val(),
                'first_name': form.find('input[name=first_name]').val(),
                'last_name': form.find('input[name=last_name]').val(),
                'company_name': form.find('input[name=company_name]').val(),
                // 'phone': form.find('input[name=phone]').val(),
                // 'term': form.find('input[name=term]').is(":checked") ? 1 : '',
                'g-recaptcha-response': form.find('[name=g-recaptcha-response]').val(),
            },
            'type': 'POST',
            beforeSend: function () {
                form.find('.error').hide();
                form.find('.icon-loading').css("display", 'inline-block');
            },
            success: function (data) {
                form.find('.icon-loading').hide();
                if (data.error === true) {
                    if (data.messages !== undefined) {
                        for(var item in data.messages) {
                            var msg = data.messages[item];
                            form.find('.error-'+item).show().text(msg[0]);
                        }
                    }
                    if (data.messages.message_error !== undefined) {
                        form.find('.message-error').show().html('<div class="alert alert-danger">' + data.messages.message_error[0] + '</div>');
                    }
                }
                if (data.redirect !== undefined) {
                    window.location.href = data.redirect
                }
            },
            error:function (e) {
                form.find('.icon-loading').hide();
                if(typeof e.responseJSON !== "undefined" && typeof e.responseJSON.message !='undefined'){
                    form.find('.message-error').show().html('<div class="alert alert-danger">' + e.responseJSON.message + '</div>');
                }
            }
        });
    })

    var onSubmitSubscribe = false;
    //Subscribe box
    $('.bc-subscribe-form').on('submit',function (e) {
        e.preventDefault();

        if (onSubmitSubscribe) return;

        $(this).addClass('loading');
        var me = $(this);
        me.find('.form-mess').html('');

        $.ajax({
            url: me.attr('action'),
            type: 'post',
            data: $(this).serialize(),
            dataType: 'json',
            success: function (json) {
                onSubmitSubscribe = false;
                me.removeClass('loading');

                if (json.message) {
                    me.find('.form-mess').html('<span class="' + (json.status ? 'text-success' : 'text-danger') + '">' + json.message + '</span>');
                }

                if (json.status) {
                    me.find('input').val('');
                }

            },
            error: function (e) {
                console.log(e);
                onSubmitSubscribe = false;
                me.removeClass('loading');

                if(parseErrorMessage(e)){
                    me.find('.form-mess').html('<span class="text-danger">' + parseErrorMessage(e) + '</span>');
                }else
                if (e.responseText) {
                    me.find('.form-mess').html('<span class="text-danger">' + e.responseText + '</span>');
                }

            }
        });

        return false;
    });

    var onSubmitContact = false;
    //Contact box
    $('.bravo-contact-block-form').on('submit',function (e) {
        e.preventDefault();
        if (onSubmitContact) return;
        $(this).addClass('loading');
        var me = $(this);
        me.find('.form-mess').html('');
        $.ajax({
            url: me.attr('action'),
            type: 'post',
            data: $(this).serialize(),
            dataType: 'json',
            success: function (json) {
                onSubmitContact = false;
                me.removeClass('loading');
                if (json.message) {
                    me.find('.form-mess').html('<span class="' + (json.status ? 'text-success' : 'text-danger') + '">' + json.message + '</span>');
                }
                if (json.status) {
                    me.find('input[type="text"], input[type="email"], input[type="tel"]').val('');
                    me.find('textarea').val('');
                }
            },
            error: function (e) {
                console.log(e);
                onSubmitContact = false;
                me.removeClass('loading');
                if(parseErrorMessage(e)){
                    me.find('.form-mess').html('<span class="text-danger">' + parseErrorMessage(e) + '</span>');
                }else
                if (e.responseText) {
                    me.find('.form-mess').html('<span class="text-danger">' + e.responseText + '</span>');
                }
            }
        });
        return false;
    });

    $('.review_upload_item').on('click',function (e) {
        var p  = $(e.target).data('target');
        var fotorama = $(p+' .fotorama').fotorama();

    });

    //Review
    $('.sfeedbacks_form .sspd_review .fa').each(function () {
        var list = $(this).parent(),
            listItems = list.children(),
            itemIndex = $(this).index(),
            parentItem = list.parent();
            $(this).hover(function(){
                for (var i = 0; i < listItems.length; i++) {
                    if (i <= itemIndex) {
                        $(listItems[i]).addClass('hovered');
                    } else {
                        break;
                    }
                }
                $(this).click(function(){
                    for (var i = 0; i < listItems.length; i++) {
                        if (i <= itemIndex) {
                            $(listItems[i]).addClass('selected');
                        } else {
                            $(listItems[i]).removeClass('selected');
                        }
                    }
                    parentItem.children('.review_stats').val(itemIndex + 1);
                });
            }, function () {
                listItems.removeClass('hovered');
            });
    });

    $('[data-toggle="tooltip"]').tooltip();

    $('.dropdown-toggle').dropdown();

    $(".smart-search .smart-search-location").each(function () {
        var $this = $(this);
        var string_list = $this.attr('data-default');
        var default_list = [];
        if(string_list.length > 0){
            default_list = JSON.parse(string_list);
        }
        var options = {
            url: extraStaff.url+'/location/search/searchForSelect2',
            dataDefault: default_list,
            textLoading: $this.attr("data-onLoad"),
            iconItem: "icofont-location-pin",
        };
        $this.bravoAutocomplete(options);
    });

    $(".smart-search .smart-select").each(function () {
        var $this = $(this);
        var string_list = $this.attr('data-default');
        var default_list = [];
        if(string_list.length > 0){
            default_list = JSON.parse(string_list);
        }
        var options = {
            dataDefault: default_list,
            iconItem: "",
            textLoading: $this.attr("data-onLoad"),
        };
        $this.bravoAutocomplete(options);
    });

    $(document).on("click",".service-wishlist",function(e){
        e.preventDefault();
        var $this = $(this);
        $.ajax({
            url:  extraStaff.url+'/user/wishlist',
            data: {
                object_id: $this.attr("data-id"),
                object_model: $this.attr("data-type"),
            },
            dataType: 'json',
            type: 'POST',
            beforeSend: function() {
                $this.addClass("loading");
            },
            success: function (res) {
                $($this).removeClass("active");
                $this.removeClass("loading");
                $this.addClass(res.class);
                if(res.fragments){
                    for(var k in res.fragments){
                        $(k).html(res.fragments[k]);
                    }
                }
            },
            error:function (e) {
                $this.removeClass("loading");
                if(e.status === 401){
                    const wishlistEvent = new CustomEvent("wishlistNeedLogin");
                    document.dispatchEvent(wishlistEvent);
                    if($('#login').length){
                        $('#login').modal('show');
                    }
                }
            }
        })
    });

    $(document).on('click', '.bc-call-modal.login', function(event) {
        event.preventDefault();
        this.blur();
        $("#login").modal({
            fadeDuration: 300,
            fadeDelay: 0.15
        });
    })

    $(document).on('click', '.bc-call-modal.signup', function(event) {
        event.preventDefault();
        this.blur();
        $("#register").modal({
            fadeDuration: 300,
            fadeDelay: 0.15
        });
    });

    $(document).on("click", ".bc-call-modal", function(e){
        e.preventDefault();
        this.blur();
        var id = $(this).attr("href");
        if($(id).length){
            $(id).modal({
                fadeDuration: 300,
                fadeDelay: 0.15
            });
        }
    })

    $(".report-form button[type=submit]").on("click", function (e) {
        e.preventDefault();
        var form = $(this).closest("form");
        form.find(".error").empty();
        $(".form-mess").empty();
        form.addClass("is-loading");
        $.ajax({
            url: form.attr("action"),
            type: 'POST',
            dataType: 'json',
            data: form.serialize(),
            success:function(data){
                form.removeClass('is-loading');
                if (data.error) {
                    for(var item in data.messages) {
                        var msg = data.messages[item];
                        form.find('.error-'+item).show().text(msg[0]);
                    }
                }
                if (data.message) {
                    form.find('.form-mess').html('<span class="' + (data.status ? 'text-success' : 'text-danger') + '">' + data.message + '</span>');
                    form.trigger("reset");
                }
            },
            error:function (e) {
                console.log(e);
                form.removeClass('is-loading');
            }
        });
    })

    let closeAlert;
    $(".bc-require-candidate-apply").on("click", function (e) {
        e.preventDefault();
        $(".bc-alert-popup").addClass("active").find('.message-box').html($(this).attr('data-require-text'));
        if(closeAlert){
            clearTimeout(closeAlert);
        }
        closeAlert = setTimeout(function(){
            $(".bc-alert-popup").removeClass('active').find('.message-box').empty();
            }, 3000);
    })

    $(document).on('click', '.bc-call-modal.apply-job', function(event) {
        event.preventDefault();
        this.blur();
        $("#apply-job").modal({
            fadeDuration: 300,
            fadeDelay: 0.15
        });
    });

    let cv_file, file;
    if($(".bc-drag-area").length > 0) {
        //selecting all required elements
        const dropArea = document.querySelector(".bc-drag-area"),
            button = $(".bc-drag-area button"),
            input = $(".bc-drag-area input");

        button.on("click", function () {
            input.click();
        });
        input.on("change", function () {
            if (this.files[0]) {
                file = this.files[0];
                dropArea.classList.add("active");
                showFile();
            }
        })

        dropArea.addEventListener("dragover", (event) => {
            event.preventDefault();
            dropArea.classList.add("active");
        });

        dropArea.addEventListener("dragleave", () => {
            dropArea.classList.remove("active");
        });
        dropArea.addEventListener("drop", (event) => {
            event.preventDefault();
            file = event.dataTransfer.files[0];
            showFile();
        });
        $(".bc-drag-area").on("click", ".remove-file", function () {
            file = false;
            cv_file = false;
            input.val(null);
            button.text(button.attr('data-text'));
            dropArea.classList.remove("active");
            dropArea.classList.remove("has-file");
        });

        function showFile() {
            let fileType = file.type;
            let validExtensions = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
            if (validExtensions.includes(fileType)) {
                button.text(file.name);
                cv_file = file;
                dropArea.classList.add("has-file");
                // let fileReader = new FileReader();
                // fileReader.onload = ()=>{
                //     let fileURL = fileReader.result;
                // }
                // fileReader.readAsDataURL(file);
            } else {
                alert("This file is not supported");
                dropArea.classList.remove("active");
            }
        }
    }

    var applyJobAjax;
    $(".job-apply-form").on("submit", function (e) {
        e.preventDefault();

        var t = $(this);
        if (applyJobAjax) {
            applyJobAjax.abort();
        }
        if (t.hasClass('loading')) {
            return false;
        }
        var form_id = $(this).attr('id');
        var error = true;
        if (t.find('input[name="apply_cv_id"]:checked').val() || cv_file) {
            error = false;
        }

        if (!error) {
            t.find('.alert').remove();
            t.addClass('loading');
            t.find('apply-alert').remove();
            var form_data = new FormData($('#' + form_id)[0]);

            if(cv_file){
                form_data.append('cv_file', cv_file);
            }
            applyJobAjax = $.ajax({
                url: extraStaff.routes.applyJob,
                type: 'POST',
                dataType: 'json',
                data: form_data,
                processData: false,
                contentType: false,
                success:function(res){
                    t.removeClass('loading');
                    if(res.status == 1){
                        t.prepend('<div class="apply-alert message-box success">' + res.message + '</div>');
                        $('.bc-apply-job-button').removeClass('.bc-call-modal').text(i18n.applied);
                        cv_file = false;
                        setTimeout(function () {
                            const applyEvent = new CustomEvent("afterAppliedJob");
                            document.dispatchEvent(applyEvent);
                            var applyJob = $("#apply-job");
                            if( typeof applyJob.modal == "function") {
                                applyJob.modal('hide');
                                setTimeout(() => { applyJob.remove() }, 200);
                            }
                        }, 2000);
                    }else{
                        t.prepend('<div class="apply-alert message-box error">' + res.message + '</div>');
                    }
                },
                error:function (e) {
                    console.log(e);
                    t.removeClass('loading');
                }
            });
        } else {
            alert(i18n.chooseACv);
        }
    })

    $(".bc-select-has-delete .chosen-select").on("change", function (evt, params) {
        deleteSelect($(this));
    });

    function deleteSelect(t) {
        var selected = t.val();
        if(selected){
            t.closest('.bc-select-has-delete').find('.remove-selected').remove();
            t.closest('.bc-select-has-delete').append('<span class="remove-selected"><i class="flaticon-close-1"></i></span>');
        }
    }
    $(".bc-select-has-delete .chosen-select").each(function(){
        deleteSelect($(this));
    });

    $(".bc-select-has-delete").on("click", ".remove-selected", function () {
        var select = $(this).closest(".bc-select-has-delete").find(".chosen-select");
        select.val('');
        select.trigger("chosen:updated");
        var selected = select.find(":selected").text();
        $(this).closest(".bc-select-has-delete").find(".chosen-single span").text(selected);

        $(this).remove();
    });

    $(window).load(function () {
        var ww = $(window).width();
        var hh = $("header.main-header").height();
        if(ww > 1024) {
            $(".header-span").css({height: hh + 'px'});
        }
    });

    $(".dropdown-notifications .notify-button").on("click", function (e) {
        e.preventDefault();
        $(this).parent().toggleClass("active");
    })

});

jQuery(function($){
    "use strict"
    var notificationsWrapper   = $('.dropdown-notifications');
    var notificationsToggle    = notificationsWrapper.find('a[data-toggle]');
    var notificationsCountElem = notificationsToggle.find('.notification-icon');
    var notificationsCount     = parseInt(notificationsCountElem.html());
    var notifications          = notificationsWrapper.find('ul.dropdown-list-items');

    if(extraStaff.pusher_api_key && extraStaff.pusher_cluster){
        var pusher = new Pusher(extraStaff.pusher_api_key, {
            encrypted: true,
            cluster: extraStaff.pusher_cluster
        });
    }

    $(document).on("click",".markAsRead",function(e) {
        e.stopPropagation();
        e.preventDefault();
        var id = $(this).data('id');
        var url = $(this).attr('href');
        $.ajax({
            url: extraStaff.markAsRead,
            data: {'id' : id },
            method: "post",
            success:function (res) {
                window.location.href = url;
            }
        })
    });
    $(document).on("click",".markAllAsRead",function(e) {
        e.stopPropagation();
        e.preventDefault();
        var t = $(this);
        t.addClass("loading");
        $.ajax({
            url: extraStaff.markAllAsRead,
            method: "post",
            success:function (res) {
                $('.dropdown-notifications').find('li.notification').removeClass('active');
                notificationsCountElem.text(0);
                notificationsWrapper.find('.notify-count').text(0);
                t.removeClass("loading");
            }
        })
    });

    var callback = function(data) {
        var existingNotifications = notifications.html();
        var newNotificationHtml = '<li class="notification active">'
            +'<div class="media">'
            +'    <div class="media-left">'
            +'      <div class="media-object">'
            +  data.avatar
            +'      </div>'
            +'    </div>'
            +'    <div class="media-body">'
            +'      <a class="markAsRead p-0" data-id="'+data.idNotification+'" href="'+data.link+'">'+data.message+'</a>'
            +'      <div class="notification-meta">'
            +'        <small class="timestamp">about a few seconds ago</small>'
            +'      </div>'
            +'    </div>'
            +'  </div>'
            +'</li>';
        notifications.html(newNotificationHtml + existingNotifications);

        notificationsCount += 1;
        notificationsCountElem.text(notificationsCount);
        notificationsWrapper.find('.notif-count').text(notificationsCount);
    };

    if(extraStaff.isAdmin > 0 && extraStaff.pusher_api_key){
        var channel = pusher.subscribe('admin-channel');
        channel.bind('App\\Events\\PusherNotificationAdminEvent', callback);
    }

    if(extraStaff.currentUser > 0 && extraStaff.pusher_api_key){
        var channelPrivate = pusher.subscribe('user-channel-'+extraStaff.currentUser);
        channelPrivate.bind('App\\Events\\PusherNotificationPrivateEvent', callback);
    }
    $(document).on("click",".sidebar-column .btn-send-message",function(e) {
        e.preventDefault();
        $([document.documentElement, document.body]).animate({
            scrollTop: $(".contact-widget").offset().top
        }, 2000);
    });

    $(".bc-delete-item").on("click", function (e) {
        if(!confirm($(this).attr('data-confirm'))){
            return false;
        }
    });

    $(".remove-wishlist").on("click", function (e) {
        e.preventDefault();
        var t = $(this);
        if(!confirm($(this).attr('data-confirm'))){
            return false;
        }
        var id = $(this).attr('data-id');
        $.ajax({
            url: extraStaff.url + '/user/wishlist/remove/',
            data: {
                id
            },
            method: "post",
            success:function (res) {
                if(res.status == 1){
                    if(t.closest('.wishlist-item').length) {
                        t.closest('.wishlist-item').remove();
                    }
                    if(t.closest('.company-bookmark-item').length){
                        t.closest('.company-bookmark-item').remove();
                    }
                    if(t.closest('.candidate-block-three').length){
                        t.closest('.candidate-block-three').remove();
                    }
                    if(res.fragments){
                        for(var k in res.fragments){
                            $(k).html(res.fragments[k]);
                        }
                    }
                }
            }
        })
    });

    function makeid(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    $('.has-ckeditor').each(function () {
        var els  = $(this);

        var id = $(this).attr('id');

        if(!id){
            id = makeid(10);
            $(this).attr('id',id);
        }
        var h  = els.data('height');
        if(!h && typeof h =='undefined') h = 300;

        var remove_script_host = true;
        if($(this).attr("data-fullurl") === "true"){
            remove_script_host = false;
        }


        tinymce.init({
            selector:'#'+id,
            plugins: 'preview searchreplace autolink code fullscreen image link media codesample table charmap hr toc advlist lists wordcount textpattern help pagebreak hr',
            toolbar: 'formatselect | bold italic strikethrough forecolor backcolor permanentpen formatpainter | link image media | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | pagebreak codesample code | removeformat',
            image_advtab: false,
            image_caption: false,
            toolbar_drawer: 'sliding',
            relative_urls : false,
            remove_script_host : remove_script_host,
            height:h,
            file_picker_callback: function (callback, value, meta) {
                /* Provide file and text for the link dialog */
                if (meta.filetype === 'file') {
                    uploaderModal.show({
                        multiple:false,
                        file_type:'video',
                        onSelect:function (files) {
                            if(files.length)
                                callback(extraStaff.url+'/media/preview/'+files[0].id);
                        },
                    });
                }

                /* Provide image and alt text for the image dialog */
                if (meta.filetype === 'image') {
                    uploaderModal.show({
                        multiple:false,
                        file_type:'image',
                        onSelect:function (files) {
                            console.log(files);
                            if(files.length)
                                callback(files[0].full_size);
                        },
                    });
                }

                /* Provide alternative source and posted for the media dialog */
                if (meta.filetype === 'media') {
                    uploaderModal.show({
                        multiple:false,
                        file_type:'video',
                        onSelect:function (files) {
                            if(files.length)
                                callback(extraStaff.url+'/media/preview/'+files[0].id);
                        },
                    });
                }
            },
        });

    });

    $(document).ready(function () {
        $('.dungdt-select2-field').each(function () {
            var configs = $(this).data('options');
            $(this).select2(configs);
        });

        $('.bc-select2').each(function () {
            var configs = $(this).data('options');
            $(this).select2(configs);
        });
    });

    $(document).on('click', '.bc-call-modal', function(e) {
        e.preventDefault();
        this.blur();
        var id = $(this).attr("href");
        $(id).modal({
            fadeDuration: 300,
            fadeDelay: 0.15
        });
    });

    let closeAlert;
    $(".bc-required").on("click", function (e) {
        e.preventDefault();
        $(".bc-alert-popup").addClass("active").find('.message-box').html($(this).attr('data-require-text'));
        if(closeAlert){
            clearTimeout(closeAlert);
        }
        closeAlert = setTimeout(function(){
            $(".bc-alert-popup").removeClass('active').find('.message-box').empty();
        }, 3000);
    })

    $('input[name="type"]').on("change", function () {
        var t = $(this);
        $(".input-condition").hide();
        $('.input-condition[data-type="' + $(this).val() + '"]').show();
        var register_form = $(this).closest(".form-inner");
        register_form.find(".social-btn-two").each(function () {
            var href = $(this).attr('href');
            var urlParams = new URL(href);
            urlParams.searchParams.set('type', t.val());
            $(this).attr("href", urlParams);
        })
    })

    // sidebar mobile
    $('body').on('click', '.mobile-sidebar-btn', function(){
        if ( $('.sidebar-left').length > 0 ) {
            $('.sidebar-left').toggleClass('active');
        } else if ( $('.sidebar-right').length > 0 ) {
            $('.sidebar-right').toggleClass('active');
        }
        $('.mobile-sidebar-panel-overlay').toggleClass('active');
    });
    $('body').on('click', '.mobile-sidebar-panel-overlay, .close-sidebar-btn', function(){
        if ( $('.sidebar-left').length > 0 ) {
            $('.sidebar-left').removeClass('active');
        } else if ( $('.sidebar-right').length > 0 ) {
            $('.sidebar-right').removeClass('active');
        }
        $('.mobile-sidebar-panel-overlay').removeClass('active');
    });

});


(function ($) {
    "use strict";
    let heroBanner_style9 = $('.hero-banner.style-9');
    let heroBanner_civi_07 = $('.hero-banner.style-12');
    function CiviFancyHeadingHandler($scope) {
        var $element = $scope.find(".civi-fancy-heading");

        var options_default = {
            animationDelay: 4000,
            barAnimationDelay: 3000,
            typingSpeed: 200,
            typingDelay: 2000,
            typingLoop: false,
            typingCursor: false,
        };

        $element.each(function () {
            var $this = $(this);
            var options = $this.data("settings-options");
            var animationDelay = (options !== undefined) ? options.animationDelay : [];
            options = $.extend({}, options_default, options);
            options.barAnimationDelay = options.animationDelay;

            if (options.animationDelay < 3000) {
                options.barWaiting = options.animationDelay * (10 / 100);
            }
            if (options.animationDelay >= 3000) {
                options.barWaiting = options.animationDelay - 3000;
            }

            var duration = animationDelay;

            if ($this.hasClass("loading-bar")) {
                duration = options.barAnimationDelay;
                setTimeout(function () {
                    $this.find(".civi-fancy-heading-animated").addClass("is-loading");
                }, options.barWaiting);
            }

            setTimeout(function () {
                hideWord($this.find(".civi-fancy-heading-show").eq(0), options);
            }, duration);
        });

        function hideWord($word, options) {
            var nextWord = takeNext($word);
            if (
                $word
                    .parents(".civi-fancy-heading")
                    .hasClass("civi-fancy-heading-loading")
            ) {
                $word.parent(".civi-fancy-heading-animated").removeClass("is-loading");
                switchWord($word, nextWord);
                setTimeout(function () {
                    hideWord(nextWord, options);
                }, options.barAnimationDelay);
                setTimeout(function () {
                    $word.parent(".civi-fancy-heading-animated").addClass("is-loading");
                }, options.barWaiting);
            } else {
                switchWord($word, nextWord);
                setTimeout(function () {
                    hideWord(nextWord, options);
                }, options.animationDelay);
            }
        }

        function takeNext($word) {
            return !$word.is(":last-child")
                ? $word.next()
                : $word.parent().children().eq(0);
        }

        function switchWord($oldWord, $newWord) {
            $oldWord
                .removeClass("civi-fancy-heading-show")
                .addClass("civi-fancy-heading-hidden");
            $newWord
                .removeClass("civi-fancy-heading-hidden")
                .addClass("civi-fancy-heading-show");
        }
    }
    if (heroBanner_style9.length){
        CiviFancyHeadingHandler(heroBanner_style9);
    }
    if(heroBanner_civi_07.length){
        CiviFancyHeadingHandler(heroBanner_civi_07);
    }

    function tab_dashboard(obj) {
        $(".tab-dashboard ul li").removeClass("active");
        $(obj).addClass("active");
        var id = $(obj).find("a").attr("href");
        $(".tab-info").hide();
        $(id).show();
    }

    $(".tab-list li").click(function () {
        tab_dashboard(this);
        return false;
    });

    tab_dashboard($(".tab-list li:first-child"));
})(jQuery);
