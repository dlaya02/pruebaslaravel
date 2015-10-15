(function ($) {
    "use strict";
    $(document).ready( function () {
        $('.awe-carousel').each( function () {
            $(this).carouselItem();
        });

        $(".ts-item-member:not('.active-hover')").mouseenter(function(){
            $(this).addClass("hover");
        })
        .mouseleave(function(){
            $(this).removeClass("hover");
        });

    });

    $.fn.carouselItem = function () {
        var self = this,
            data = $(self).data(),
            settings = {};
        if (!data.responsive) {
            settings.items = data.items;
            if (settings.items == 1) {
                settings.transitionStyle = data.effect;
            }
        }
        else {
            settings.itemsDesktop = [1199, data.items];
            settings.itemsDesktopSmall = [979, data.itemsDesktopSmall];
            settings.itemsTablet = [768, data.itemsTablet];
            settings.itemsMobile = [479, data.itemsMobile];
        }
        if (data.pagination) {
            settings.pagination = data.pagination
        }
        if (data.navigation) {
            settings.navigation = data.navigation;
            settings.navigationText = ["<i class='icon fontello icon-angle-left'></i>","<i class='icon fontello icon-angle-right'></i>"];
        }
        if (data.auto) {
            settings.autoPlay = data.timeAuto * 1000;
            settings.stopOnHover = data.stopOnHover;
        }
        if (data.mousedrag == false) {
            settings.mouseDrag = data.mousedrag
        }
        if (data.touchdrag == false) {
            settings.touchDrag = data.touchdrag;
        }
        $(this).owlCarousel(settings);
    }

})(jQuery)
;
(function ($) {

Drupal.behaviors.textarea = {
  attach: function (context, settings) {
    $('.form-textarea-wrapper.resizable', context).once('textarea', function () {
      var staticOffset = null;
      var textarea = $(this).addClass('resizable-textarea').find('textarea');
      var grippie = $('<div class="grippie"></div>').mousedown(startDrag);

      grippie.insertAfter(textarea);

      function startDrag(e) {
        staticOffset = textarea.height() - e.pageY;
        textarea.css('opacity', 0.25);
        $(document).mousemove(performDrag).mouseup(endDrag);
        return false;
      }

      function performDrag(e) {
        textarea.height(Math.max(32, staticOffset + e.pageY) + 'px');
        return false;
      }

      function endDrag(e) {
        $(document).unbind('mousemove', performDrag).unbind('mouseup', endDrag);
        textarea.css('opacity', 1);
      }
    });
  }
};

})(jQuery);
;
/**
 * @file
 * JavaScript behaviors for the front-end display of webforms.
 */

(function ($) {

  "use strict";

  Drupal.behaviors.webform = Drupal.behaviors.webform || {};

  Drupal.behaviors.webform.attach = function (context) {
    // Calendar datepicker behavior.
    Drupal.webform.datepicker(context);

    // Conditional logic.
    if (Drupal.settings.webform && Drupal.settings.webform.conditionals) {
      Drupal.webform.conditional(context);
    }
  };

  Drupal.webform = Drupal.webform || {};

  Drupal.webform.datepicker = function (context) {
    $('div.webform-datepicker').each(function () {
      var $webformDatepicker = $(this);
      var $calendar = $webformDatepicker.find('input.webform-calendar');

      // Ensure the page we're on actually contains a datepicker.
      if ($calendar.length == 0) {
        return;
      }

      var startDate = $calendar[0].className.replace(/.*webform-calendar-start-(\d{4}-\d{2}-\d{2}).*/, '$1').split('-');
      var endDate = $calendar[0].className.replace(/.*webform-calendar-end-(\d{4}-\d{2}-\d{2}).*/, '$1').split('-');
      var firstDay = $calendar[0].className.replace(/.*webform-calendar-day-(\d).*/, '$1');
      // Convert date strings into actual Date objects.
      startDate = new Date(startDate[0], startDate[1] - 1, startDate[2]);
      endDate = new Date(endDate[0], endDate[1] - 1, endDate[2]);

      // Ensure that start comes before end for datepicker.
      if (startDate > endDate) {
        var laterDate = startDate;
        startDate = endDate;
        endDate = laterDate;
      }

      var startYear = startDate.getFullYear();
      var endYear = endDate.getFullYear();

      // Set up the jQuery datepicker element.
      $calendar.datepicker({
        dateFormat: 'yy-mm-dd',
        yearRange: startYear + ':' + endYear,
        firstDay: parseInt(firstDay),
        minDate: startDate,
        maxDate: endDate,
        onSelect: function (dateText, inst) {
          var date = dateText.split('-');
          $webformDatepicker.find('select.year, input.year').val(+date[0]).trigger('change');
          $webformDatepicker.find('select.month').val(+date[1]).trigger('change');
          $webformDatepicker.find('select.day').val(+date[2]).trigger('change');
        },
        beforeShow: function (input, inst) {
          // Get the select list values.
          var year = $webformDatepicker.find('select.year, input.year').val();
          var month = $webformDatepicker.find('select.month').val();
          var day = $webformDatepicker.find('select.day').val();

          // If empty, default to the current year/month/day in the popup.
          var today = new Date();
          year = year ? year : today.getFullYear();
          month = month ? month : today.getMonth() + 1;
          day = day ? day : today.getDate();

          // Make sure that the default year fits in the available options.
          year = (year < startYear || year > endYear) ? startYear : year;

          // jQuery UI Datepicker will read the input field and base its date off
          // of that, even though in our case the input field is a button.
          $(input).val(year + '-' + month + '-' + day);
        }
      });

      // Prevent the calendar button from submitting the form.
      $calendar.click(function (event) {
        $(this).focus();
        event.preventDefault();
      });
    });
  };

  Drupal.webform.conditional = function (context) {
    // Add the bindings to each webform on the page.
    $.each(Drupal.settings.webform.conditionals, function (formKey, settings) {
      var $form = $('.' + formKey + ':not(.webform-conditional-processed)');
      $form.each(function (index, currentForm) {
        var $currentForm = $(currentForm);
        $currentForm.addClass('webform-conditional-processed');
        $currentForm.bind('change', {'settings': settings}, Drupal.webform.conditionalCheck);

        // Trigger all the elements that cause conditionals on this form.
        Drupal.webform.doConditions($form, settings);
      });
    });
  };

  /**
   * Event handler to respond to field changes in a form.
   *
   * This event is bound to the entire form, not individual fields.
   */
  Drupal.webform.conditionalCheck = function (e) {
    var $triggerElement = $(e.target).closest('.webform-component');
    var $form = $triggerElement.closest('form');
    var triggerElementKey = $triggerElement.attr('class').match(/webform-component--[^ ]+/)[0];
    var settings = e.data.settings;
    if (settings.sourceMap[triggerElementKey]) {
      Drupal.webform.doConditions($form, settings);
    }
  };

  /**
   * Processes all conditional.
   */
  Drupal.webform.doConditions = function ($form, settings) {
    // Track what has be set/shown for each target component.
    var targetLocked = [];

    $.each(settings.ruleGroups, function (rgid_key, rule_group) {
      var ruleGroup = settings.ruleGroups[rgid_key];

      // Perform the comparison callback and build the results for this group.
      var conditionalResult = true;
      var conditionalResults = [];
      $.each(ruleGroup['rules'], function (m, rule) {
        var elementKey = rule['source'];
        var element = $form.find('.' + elementKey)[0];
        var existingValue = settings.values[elementKey] ? settings.values[elementKey] : null;
        conditionalResults.push(window['Drupal']['webform'][rule.callback](element, existingValue, rule['value']));
      });

      // Filter out false values.
      var filteredResults = [];
      for (var i = 0; i < conditionalResults.length; i++) {
        if (conditionalResults[i]) {
          filteredResults.push(conditionalResults[i]);
        }
      }

      // Calculate the and/or result.
      if (ruleGroup['andor'] === 'or') {
        conditionalResult = filteredResults.length > 0;
      }
      else {
        conditionalResult = filteredResults.length === conditionalResults.length;
      }

      $.each(ruleGroup['actions'], function (aid, action) {
        var $target = $form.find('.' + action['target']);
        var actionResult = action['invert'] ? !conditionalResult : conditionalResult;
        switch (action['action']) {
          case 'show':
            if (actionResult != Drupal.webform.isVisible($target)) {
              var $targetElements = actionResult
                                      ? $target.find('.webform-conditional-disabled').removeClass('webform-conditional-disabled')
                                      : $target.find(':input').addClass('webform-conditional-disabled');
              $targetElements.webformProp('disabled', !actionResult);
              $target.toggleClass('webform-conditional-hidden', !actionResult);
              if (actionResult) {
                $target.show();
              }
              else {
                $target.hide();
                // Record that the target was hidden.
                targetLocked[action['target']] = 'hide';
              }
            }
            break;
          case 'require':
            var $requiredSpan = $target.find('.form-required, .form-optional').first();
            if (actionResult != $requiredSpan.hasClass('form-required')) {
              var $targetInputElements = $target.find("input:text,textarea,input[type='email'],select,input:radio,input:file");
              // Rather than hide the required tag, remove it so that other jQuery can respond via Drupal behaviors.
              Drupal.detachBehaviors($requiredSpan);
              $targetInputElements
                .webformProp('required', actionResult)
                .toggleClass('required', actionResult);
              if (actionResult) {
                $requiredSpan.replaceWith('<span class="form-required" title="' + Drupal.t('This field is required.') + '">*</span>');
              }
              else {
                $requiredSpan.replaceWith('<span class="form-optional"></span>');
              }
              Drupal.attachBehaviors($requiredSpan);
            }
            break;
          case 'set':
            var isLocked = targetLocked[action['target']];
            var $texts = $target.find("input:text,textarea,input[type='email']");
            var $selects = $target.find('select,select option,input:radio,input:checkbox');
            var $markups = $target.filter('.webform-component-markup');
            if (actionResult) {
              var multiple = $.map(action['argument'].split(','), $.trim);
              $selects.webformVal(multiple);
              $texts.val([action['argument']]);
              // A special case is made for markup. It is sanitized with filter_xss_admin on the server.
              // otherwise text() should be used to avoid an XSS vulnerability. text() however would
              // preclude the use of tags like <strong> or <a>
              $markups.html(action['argument']);
            }
            else {
              // Markup not set? Then restore original markup as provided in
              // the attribute data-webform-markup.
              $markups.each(function() {
                var $this = $(this);
                var original = $this.data('webform-markup');
                if (original !== undefined) {
                  $this.html(original);
                }
              });
            }
            if (!isLocked) {
              // If not previously hidden or set, disable the element readonly or readonly-like behavior.
              $selects.webformProp('disabled', actionResult);
              $texts.webformProp('readonly', actionResult);
              targetLocked[action['target']] = actionResult ? 'set' : false;
            }
            break;
        }
      }); // End look on each action for one conditional
    }); // End loop on each conditional
  };

  /**
   * Event handler to prevent propogation of events, typically click for disabling
   * radio and checkboxes.
   */
  Drupal.webform.stopEvent = function () {
    return false;
  };

  Drupal.webform.conditionalOperatorStringEqual = function (element, existingValue, ruleValue) {
    var returnValue = false;
    var currentValue = Drupal.webform.stringValue(element, existingValue);
    $.each(currentValue, function (n, value) {
      if (value.toLowerCase() === ruleValue.toLowerCase()) {
        returnValue = true;
        return false; // break.
      }
    });
    return returnValue;
  };

  Drupal.webform.conditionalOperatorStringNotEqual = function (element, existingValue, ruleValue) {
    var found = false;
    var currentValue = Drupal.webform.stringValue(element, existingValue);
    $.each(currentValue, function (n, value) {
      if (value.toLowerCase() === ruleValue.toLowerCase()) {
        found = true;
      }
    });
    return !found;
  };

  Drupal.webform.conditionalOperatorStringContains = function (element, existingValue, ruleValue) {
    var returnValue = false;
    var currentValue = Drupal.webform.stringValue(element, existingValue);
    $.each(currentValue, function (n, value) {
      if (value.toLowerCase().indexOf(ruleValue.toLowerCase()) > -1) {
        returnValue = true;
        return false; // break.
      }
    });
    return returnValue;
  };

  Drupal.webform.conditionalOperatorStringDoesNotContain = function (element, existingValue, ruleValue) {
    var found = false;
    var currentValue = Drupal.webform.stringValue(element, existingValue);
    $.each(currentValue, function (n, value) {
      if (value.toLowerCase().indexOf(ruleValue.toLowerCase()) > -1) {
        found = true;
      }
    });
    return !found;
  };

  Drupal.webform.conditionalOperatorStringBeginsWith = function (element, existingValue, ruleValue) {
    var returnValue = false;
    var currentValue = Drupal.webform.stringValue(element, existingValue);
    $.each(currentValue, function (n, value) {
      if (value.toLowerCase().indexOf(ruleValue.toLowerCase()) === 0) {
        returnValue = true;
        return false; // break.
      }
    });
    return returnValue;
  };

  Drupal.webform.conditionalOperatorStringEndsWith = function (element, existingValue, ruleValue) {
    var returnValue = false;
    var currentValue = Drupal.webform.stringValue(element, existingValue);
    $.each(currentValue, function (n, value) {
      if (value.toLowerCase().lastIndexOf(ruleValue.toLowerCase()) === value.length - ruleValue.length) {
        returnValue = true;
        return false; // break.
      }
    });
    return returnValue;
  };

  Drupal.webform.conditionalOperatorStringEmpty = function (element, existingValue, ruleValue) {
    var currentValue = Drupal.webform.stringValue(element, existingValue);
    var returnValue = true;
    $.each(currentValue, function (n, value) {
      if (value !== '') {
        returnValue = false;
        return false; // break.
      }
    });
    return returnValue;
  };

  Drupal.webform.conditionalOperatorStringNotEmpty = function (element, existingValue, ruleValue) {
    return !Drupal.webform.conditionalOperatorStringEmpty(element, existingValue, ruleValue);
  };

  Drupal.webform.conditionalOperatorSelectGreaterThan = function (element, existingValue, ruleValue) {
    var currentValue = Drupal.webform.stringValue(element, existingValue);
    return Drupal.webform.compare_select(currentValue[0], ruleValue, element) > 0;
  };

  Drupal.webform.conditionalOperatorSelectGreaterThanEqual = function (element, existingValue, ruleValue) {
    var currentValue = Drupal.webform.stringValue(element, existingValue);
    var comparison = Drupal.webform.compare_select(currentValue[0], ruleValue, element);
    return comparison > 0 || comparison === 0;
  };

  Drupal.webform.conditionalOperatorSelectLessThan = function (element, existingValue, ruleValue) {
    var currentValue = Drupal.webform.stringValue(element, existingValue);
    return Drupal.webform.compare_select(currentValue[0], ruleValue, element) < 0;
  };

  Drupal.webform.conditionalOperatorSelectLessThanEqual = function (element, existingValue, ruleValue) {
    var currentValue = Drupal.webform.stringValue(element, existingValue);
    var comparison = Drupal.webform.compare_select(currentValue[0], ruleValue, element);
    return comparison < 0 || comparison === 0;
  };

  Drupal.webform.conditionalOperatorNumericEqual = function (element, existingValue, ruleValue) {
    // See float comparison: http://php.net/manual/en/language.types.float.php
    var currentValue = Drupal.webform.stringValue(element, existingValue);
    var epsilon = 0.000001;
    // An empty string does not match any number.
    return currentValue[0] === '' ? false : (Math.abs(parseFloat(currentValue[0]) - parseFloat(ruleValue)) < epsilon);
  };

  Drupal.webform.conditionalOperatorNumericNotEqual = function (element, existingValue, ruleValue) {
    // See float comparison: http://php.net/manual/en/language.types.float.php
    var currentValue = Drupal.webform.stringValue(element, existingValue);
    var epsilon = 0.000001;
    // An empty string does not match any number.
    return currentValue[0] === '' ? true : (Math.abs(parseFloat(currentValue[0]) - parseFloat(ruleValue)) >= epsilon);
  };

  Drupal.webform.conditionalOperatorNumericGreaterThan = function (element, existingValue, ruleValue) {
    var currentValue = Drupal.webform.stringValue(element, existingValue);
    return parseFloat(currentValue[0]) > parseFloat(ruleValue);
  };

  Drupal.webform.conditionalOperatorNumericGreaterThanEqual = function (element, existingValue, ruleValue) {
    return Drupal.webform.conditionalOperatorNumericGreaterThan(element, existingValue, ruleValue) ||
           Drupal.webform.conditionalOperatorNumericEqual(element, existingValue, ruleValue);
  };

  Drupal.webform.conditionalOperatorNumericLessThan = function (element, existingValue, ruleValue) {
    var currentValue = Drupal.webform.stringValue(element, existingValue);
    return parseFloat(currentValue[0]) < parseFloat(ruleValue);
  };

  Drupal.webform.conditionalOperatorNumericLessThanEqual = function (element, existingValue, ruleValue) {
    return Drupal.webform.conditionalOperatorNumericLessThan(element, existingValue, ruleValue) ||
           Drupal.webform.conditionalOperatorNumericEqual(element, existingValue, ruleValue);
  };

  Drupal.webform.conditionalOperatorDateEqual = function (element, existingValue, ruleValue) {
    var currentValue = Drupal.webform.dateValue(element, existingValue);
    return currentValue === ruleValue;
  };

  Drupal.webform.conditionalOperatorDateNotEqual = function (element, existingValue, ruleValue) {
    return !Drupal.webform.conditionalOperatorDateEqual(element, existingValue, ruleValue);
  };

  Drupal.webform.conditionalOperatorDateBefore = function (element, existingValue, ruleValue) {
    var currentValue = Drupal.webform.dateValue(element, existingValue);
    return (currentValue !== false) && currentValue < ruleValue;
  };

  Drupal.webform.conditionalOperatorDateBeforeEqual = function (element, existingValue, ruleValue) {
    var currentValue = Drupal.webform.dateValue(element, existingValue);
    return (currentValue !== false) && (currentValue < ruleValue || currentValue === ruleValue);
  };

  Drupal.webform.conditionalOperatorDateAfter = function (element, existingValue, ruleValue) {
    var currentValue = Drupal.webform.dateValue(element, existingValue);
    return (currentValue !== false) && currentValue > ruleValue;
  };

  Drupal.webform.conditionalOperatorDateAfterEqual = function (element, existingValue, ruleValue) {
    var currentValue = Drupal.webform.dateValue(element, existingValue);
    return (currentValue !== false) && (currentValue > ruleValue || currentValue === ruleValue);
  };

  Drupal.webform.conditionalOperatorTimeEqual = function (element, existingValue, ruleValue) {
    var currentValue = Drupal.webform.timeValue(element, existingValue);
    return currentValue === ruleValue;
  };

  Drupal.webform.conditionalOperatorTimeNotEqual = function (element, existingValue, ruleValue) {
    return !Drupal.webform.conditionalOperatorTimeEqual(element, existingValue, ruleValue);
  };

  Drupal.webform.conditionalOperatorTimeBefore = function (element, existingValue, ruleValue) {
    // Date and time operators intentionally exclusive for "before".
    var currentValue = Drupal.webform.timeValue(element, existingValue);
    return (currentValue !== false) && (currentValue < ruleValue);
  };

  Drupal.webform.conditionalOperatorTimeBeforeEqual = function (element, existingValue, ruleValue) {
    // Date and time operators intentionally exclusive for "before".
    var currentValue = Drupal.webform.timeValue(element, existingValue);
    return (currentValue !== false) && (currentValue < ruleValue || currentValue === ruleValue);
  };

  Drupal.webform.conditionalOperatorTimeAfter = function (element, existingValue, ruleValue) {
    // Date and time operators intentionally inclusive for "after".
    var currentValue = Drupal.webform.timeValue(element, existingValue);
    return (currentValue !== false) && (currentValue > ruleValue);
  };

  Drupal.webform.conditionalOperatorTimeAfterEqual = function (element, existingValue, ruleValue) {
    // Date and time operators intentionally inclusive for "after".
    var currentValue = Drupal.webform.timeValue(element, existingValue);
    return (currentValue !== false) && (currentValue > ruleValue || currentValue === ruleValue);
  };

  /**
   * Utility function to compare values of a select component.
   * @param string a
   *   First select option key to compare
   * @param string b
   *   Second select option key to compare
   * @param array options
   *   Associative array where the a and b are within the keys
   * @return integer based upon position of $a and $b in $options
   *   -N if $a above (<) $b
   *   0 if $a = $b
   *   +N if $a is below (>) $b
   */
  Drupal.webform.compare_select = function (a, b, element) {
    var optionList = [];
    $('option,input:radio,input:checkbox', element).each(function () {
      optionList.push($(this).val());
    });
    var a_position = optionList.indexOf(a);
    var b_position = optionList.indexOf(b);
    return (a_position < 0 || b_position < 0) ? null : a_position - b_position;
  };

  /**
   * Utility to return current visibility. Uses actual visibility, except for
   * hidden components which use the applied disabled class.
   */
  Drupal.webform.isVisible = function ($element) {
    return $element.hasClass('webform-component-hidden')
              ? !$element.find('input').first().hasClass('webform-conditional-disabled')
              : $element.closest('.webform-conditional-hidden').length == 0;
  };

  /**
   * Utility function to get a string value from a select/radios/text/etc. field.
   */
  Drupal.webform.stringValue = function (element, existingValue) {
    var value = [];
    if (element) {
      var $element = $(element);
      if (Drupal.webform.isVisible($element)) {
        // Checkboxes and radios.
        $element.find('input[type=checkbox]:checked,input[type=radio]:checked').each(function () {
          value.push(this.value);
        });
        // Select lists.
        if (!value.length) {
          var selectValue = $element.find('select').val();
          if (selectValue) {
            if ($.isArray(selectValue)) {
              value = selectValue;
            }
            else {
              value.push(selectValue);
            }
          }
        }
        // Simple text fields. This check is done last so that the select list in
        // select-or-other fields comes before the "other" text field.
        if (!value.length) {
          $element.find('input:not([type=checkbox],[type=radio]),textarea').each(function () {
            value.push(this.value);
          });
        }
      }
    }
    else {
      switch ($.type(existingValue)) {
        case 'array':
          value = existingValue;
          break;
        case 'string':
          value.push(existingValue);
          break;
      }
    }
    return value;
  };

  /**
   * Utility function to calculate a millisecond timestamp from a time field.
   */
  Drupal.webform.dateValue = function (element, existingValue) {
    var value = false;
    if (element) {
      var $element = $(element);
      if (Drupal.webform.isVisible($element)) {
        var day = $element.find('[name*=day]').val();
        var month = $element.find('[name*=month]').val();
        var year = $element.find('[name*=year]').val();
        // Months are 0 indexed in JavaScript.
        if (month) {
          month--;
        }
        if (year !== '' && month !== '' && day !== '') {
          value = Date.UTC(year, month, day) / 1000;
        }
      }
    }
    else {
      if ($.type(existingValue) === 'array' && existingValue.length) {
        existingValue = existingValue[0];
      }
      if ($.type(existingValue) === 'string') {
        existingValue = existingValue.split('-');
      }
      if (existingValue.length === 3) {
        value = Date.UTC(existingValue[0], existingValue[1], existingValue[2]) / 1000;
      }
    }
    return value;
  };

  /**
   * Utility function to calculate a millisecond timestamp from a time field.
   */
  Drupal.webform.timeValue = function (element, existingValue) {
    var value = false;
    if (element) {
      var $element = $(element);
      if (Drupal.webform.isVisible($element)) {
        var hour = $element.find('[name*=hour]').val();
        var minute = $element.find('[name*=minute]').val();
        var ampm = $element.find('[name*=ampm]:checked').val();

        // Convert to integers if set.
        hour = (hour === '') ? hour : parseInt(hour);
        minute = (minute === '') ? minute : parseInt(minute);

        if (hour !== '') {
          hour = (hour < 12 && ampm == 'pm') ? hour + 12 : hour;
          hour = (hour === 12 && ampm == 'am') ? 0 : hour;
        }
        if (hour !== '' && minute !== '') {
          value = Date.UTC(1970, 0, 1, hour, minute) / 1000;
        }
      }
    }
    else {
      if ($.type(existingValue) === 'array' && existingValue.length) {
        existingValue = existingValue[0];
      }
      if ($.type(existingValue) === 'string') {
        existingValue = existingValue.split(':');
      }
      if (existingValue.length >= 2) {
        value = Date.UTC(1970, 0, 1, existingValue[0], existingValue[1]) / 1000;
      }
    }
    return value;
  };

  /**
   * Make a prop shim for jQuery < 1.9.
   */
  $.fn.webformProp = $.fn.webformProp || function (name, value) {
    if (value) {
      return $.fn.prop ? this.prop(name, true) : this.attr(name, true);
    }
    else {
      return $.fn.prop ? this.prop(name, false) : this.removeAttr(name);
    }
  };

  /**
   * Make a multi-valued val() function for setting checkboxes, radios, and select
   * elements.
   */
  $.fn.webformVal = function (values) {
    this.each(function () {
      var $this = $(this);
      var value = $this.val();
      var on = $.inArray($this.val(), values) != -1;
      if (this.nodeName == 'OPTION') {
        $this.webformProp('selected', on ? value : false);
      }
      else {
        $this.val(on ? [value] : false);
      }
    });
    return this;
  };

})(jQuery);
;
/*
 * jQuery FlexSlider v2.2.2
 * Copyright 2012 WooThemes
 * Contributing Author: Tyler Smith
 */
;
(function ($) {

  //FlexSlider: Object Instance
  $.flexslider = function(el, options) {
    var slider = $(el);

    // making variables public
    slider.vars = $.extend({}, $.flexslider.defaults, options);

    var namespace = slider.vars.namespace,
        msGesture = window.navigator && window.navigator.msPointerEnabled && window.MSGesture,
        touch = (( "ontouchstart" in window ) || msGesture || window.DocumentTouch && document instanceof DocumentTouch) && slider.vars.touch,
        // depricating this idea, as devices are being released with both of these events
        //eventType = (touch) ? "touchend" : "click",
        eventType = "click touchend MSPointerUp keyup",
        watchedEvent = "",
        watchedEventClearTimer,
        vertical = slider.vars.direction === "vertical",
        reverse = slider.vars.reverse,
        carousel = (slider.vars.itemWidth > 0),
        fade = slider.vars.animation === "fade",
        asNav = slider.vars.asNavFor !== "",
        methods = {},
        focused = true;

    // Store a reference to the slider object
    $.data(el, "flexslider", slider);

    // Private slider methods
    methods = {
      init: function() {
        slider.animating = false;
        // Get current slide and make sure it is a number
        slider.currentSlide = parseInt( ( slider.vars.startAt ? slider.vars.startAt : 0), 10 );
        if ( isNaN( slider.currentSlide ) ) slider.currentSlide = 0;
        slider.animatingTo = slider.currentSlide;
        slider.atEnd = (slider.currentSlide === 0 || slider.currentSlide === slider.last);
        slider.containerSelector = slider.vars.selector.substr(0,slider.vars.selector.search(' '));
        slider.slides = $(slider.vars.selector, slider);
        slider.container = $(slider.containerSelector, slider);
        slider.count = slider.slides.length;
        // SYNC:
        slider.syncExists = $(slider.vars.sync).length > 0;
        // SLIDE:
        if (slider.vars.animation === "slide") slider.vars.animation = "swing";
        slider.prop = (vertical) ? "top" : "marginLeft";
        slider.args = {};
        // SLIDESHOW:
        slider.manualPause = false;
        slider.stopped = false;
        //PAUSE WHEN INVISIBLE
        slider.started = false;
        slider.startTimeout = null;
        // TOUCH/USECSS:
        slider.transitions = !slider.vars.video && !fade && slider.vars.useCSS && (function() {
          var obj = document.createElement('div'),
              props = ['perspectiveProperty', 'WebkitPerspective', 'MozPerspective', 'OPerspective', 'msPerspective'];
          for (var i in props) {
            if ( obj.style[ props[i] ] !== undefined ) {
              slider.pfx = props[i].replace('Perspective','').toLowerCase();
              slider.prop = "-" + slider.pfx + "-transform";
              return true;
            }
          }
          return false;
        }());
        slider.ensureAnimationEnd = '';
        // CONTROLSCONTAINER:
        if (slider.vars.controlsContainer !== "") slider.controlsContainer = $(slider.vars.controlsContainer).length > 0 && $(slider.vars.controlsContainer);
        // MANUAL:
        if (slider.vars.manualControls !== "") slider.manualControls = $(slider.vars.manualControls).length > 0 && $(slider.vars.manualControls);

        // RANDOMIZE:
        if (slider.vars.randomize) {
          slider.slides.sort(function() { return (Math.round(Math.random())-0.5); });
          slider.container.empty().append(slider.slides);
        }

        slider.doMath();

        // INIT
        slider.setup("init");

        // CONTROLNAV:
        if (slider.vars.controlNav) methods.controlNav.setup();

        // DIRECTIONNAV:
        if (slider.vars.directionNav) methods.directionNav.setup();

        // KEYBOARD:
        if (slider.vars.keyboard && ($(slider.containerSelector).length === 1 || slider.vars.multipleKeyboard)) {
          $(document).bind('keyup', function(event) {
            var keycode = event.keyCode;
            if (!slider.animating && (keycode === 39 || keycode === 37)) {
              var target = (keycode === 39) ? slider.getTarget('next') :
                           (keycode === 37) ? slider.getTarget('prev') : false;
              slider.flexAnimate(target, slider.vars.pauseOnAction);
            }
          });
        }
        // MOUSEWHEEL:
        if (slider.vars.mousewheel) {
          slider.bind('mousewheel', function(event, delta, deltaX, deltaY) {
            event.preventDefault();
            var target = (delta < 0) ? slider.getTarget('next') : slider.getTarget('prev');
            slider.flexAnimate(target, slider.vars.pauseOnAction);
          });
        }

        // PAUSEPLAY
        if (slider.vars.pausePlay) methods.pausePlay.setup();

        //PAUSE WHEN INVISIBLE
        if (slider.vars.slideshow && slider.vars.pauseInvisible) methods.pauseInvisible.init();

        // SLIDSESHOW
        if (slider.vars.slideshow) {
          if (slider.vars.pauseOnHover) {
            slider.hover(function() {
              if (!slider.manualPlay && !slider.manualPause) slider.pause();
            }, function() {
              if (!slider.manualPause && !slider.manualPlay && !slider.stopped) slider.play();
            });
          }
          // initialize animation
          //If we're visible, or we don't use PageVisibility API
          if(!slider.vars.pauseInvisible || !methods.pauseInvisible.isHidden()) {
            (slider.vars.initDelay > 0) ? slider.startTimeout = setTimeout(slider.play, slider.vars.initDelay) : slider.play();
          }
        }

        // ASNAV:
        if (asNav) methods.asNav.setup();

        // TOUCH
        if (touch && slider.vars.touch) methods.touch();

        // FADE&&SMOOTHHEIGHT || SLIDE:
        if (!fade || (fade && slider.vars.smoothHeight)) $(window).bind("resize orientationchange focus", methods.resize);

        slider.find("img").attr("draggable", "false");

        // API: start() Callback
        setTimeout(function(){
          slider.vars.start(slider);
        }, 200);
      },
      asNav: {
        setup: function() {
          slider.asNav = true;
          slider.animatingTo = Math.floor(slider.currentSlide/slider.move);
          slider.currentItem = slider.currentSlide;
          slider.slides.removeClass(namespace + "active-slide").eq(slider.currentItem).addClass(namespace + "active-slide");
          if(!msGesture){
              slider.slides.on(eventType, function(e){
                e.preventDefault();
                var $slide = $(this),
                    target = $slide.index();
                var posFromLeft = $slide.offset().left - $(slider).scrollLeft(); // Find position of slide relative to left of slider container
                if( posFromLeft <= 0 && $slide.hasClass( namespace + 'active-slide' ) ) {
                  slider.flexAnimate(slider.getTarget("prev"), true);
                } else if (!$(slider.vars.asNavFor).data('flexslider').animating && !$slide.hasClass(namespace + "active-slide")) {
                  slider.direction = (slider.currentItem < target) ? "next" : "prev";
                  slider.flexAnimate(target, slider.vars.pauseOnAction, false, true, true);
                }
              });
          }else{
              el._slider = slider;
              slider.slides.each(function (){
                  var that = this;
                  that._gesture = new MSGesture();
                  that._gesture.target = that;
                  that.addEventListener("MSPointerDown", function (e){
                      e.preventDefault();
                      if(e.currentTarget._gesture)
                          e.currentTarget._gesture.addPointer(e.pointerId);
                  }, false);
                  that.addEventListener("MSGestureTap", function (e){
                      e.preventDefault();
                      var $slide = $(this),
                          target = $slide.index();
                      if (!$(slider.vars.asNavFor).data('flexslider').animating && !$slide.hasClass('active')) {
                          slider.direction = (slider.currentItem < target) ? "next" : "prev";
                          slider.flexAnimate(target, slider.vars.pauseOnAction, false, true, true);
                      }
                  });
              });
          }
        }
      },
      controlNav: {
        setup: function() {
          if (!slider.manualControls) {
            methods.controlNav.setupPaging();
          } else { // MANUALCONTROLS:
            methods.controlNav.setupManual();
          }
        },
        setupPaging: function() {
          var type = (slider.vars.controlNav === "thumbnails") ? 'control-thumbs' : 'control-paging',
              j = 1,
              item,
              slide;

          slider.controlNavScaffold = $('<ol class="'+ namespace + 'control-nav ' + namespace + type + '"></ol>');

          if (slider.pagingCount > 1) {
            for (var i = 0; i < slider.pagingCount; i++) {
              slide = slider.slides.eq(i);
              item = (slider.vars.controlNav === "thumbnails") ? '<img src="' + slide.attr( 'data-thumb' ) + '"/>' : '<a>' + j + '</a>';
              if ( 'thumbnails' === slider.vars.controlNav && true === slider.vars.thumbCaptions ) {
                var captn = slide.attr( 'data-thumbcaption' );
                if ( '' != captn && undefined != captn ) item += '<span class="' + namespace + 'caption">' + captn + '</span>';
              }
              slider.controlNavScaffold.append('<li>' + item + '</li>');
              j++;
            }
          }

          // CONTROLSCONTAINER:
          (slider.controlsContainer) ? $(slider.controlsContainer).append(slider.controlNavScaffold) : slider.append(slider.controlNavScaffold);
          methods.controlNav.set();

          methods.controlNav.active();

          slider.controlNavScaffold.delegate('a, img', eventType, function(event) {
            event.preventDefault();

            if (watchedEvent === "" || watchedEvent === event.type) {
              var $this = $(this),
                  target = slider.controlNav.index($this);

              if (!$this.hasClass(namespace + 'active')) {
                slider.direction = (target > slider.currentSlide) ? "next" : "prev";
                slider.flexAnimate(target, slider.vars.pauseOnAction);
              }
            }

            // setup flags to prevent event duplication
            if (watchedEvent === "") {
              watchedEvent = event.type;
            }
            methods.setToClearWatchedEvent();

          });
        },
        setupManual: function() {
          slider.controlNav = slider.manualControls;
          methods.controlNav.active();

          slider.controlNav.bind(eventType, function(event) {
            event.preventDefault();

            if (watchedEvent === "" || watchedEvent === event.type) {
              var $this = $(this),
                  target = slider.controlNav.index($this);

              if (!$this.hasClass(namespace + 'active')) {
                (target > slider.currentSlide) ? slider.direction = "next" : slider.direction = "prev";
                slider.flexAnimate(target, slider.vars.pauseOnAction);
              }
            }

            // setup flags to prevent event duplication
            if (watchedEvent === "") {
              watchedEvent = event.type;
            }
            methods.setToClearWatchedEvent();
          });
        },
        set: function() {
          var selector = (slider.vars.controlNav === "thumbnails") ? 'img' : 'a';
          slider.controlNav = $('.' + namespace + 'control-nav li ' + selector, (slider.controlsContainer) ? slider.controlsContainer : slider);
        },
        active: function() {
          slider.controlNav.removeClass(namespace + "active").eq(slider.animatingTo).addClass(namespace + "active");
        },
        update: function(action, pos) {
          if (slider.pagingCount > 1 && action === "add") {
            slider.controlNavScaffold.append($('<li><a>' + slider.count + '</a></li>'));
          } else if (slider.pagingCount === 1) {
            slider.controlNavScaffold.find('li').remove();
          } else {
            slider.controlNav.eq(pos).closest('li').remove();
          }
          methods.controlNav.set();
          (slider.pagingCount > 1 && slider.pagingCount !== slider.controlNav.length) ? slider.update(pos, action) : methods.controlNav.active();
        }
      },
      directionNav: {
        setup: function() {
          var directionNavScaffold = $('<ul class="' + namespace + 'direction-nav"><li><a class="' + namespace + 'prev" href="#">' + slider.vars.prevText + '</a></li><li><a class="' + namespace + 'next" href="#">' + slider.vars.nextText + '</a></li></ul>');

          // CONTROLSCONTAINER:
          if (slider.controlsContainer) {
            $(slider.controlsContainer).append(directionNavScaffold);
            slider.directionNav = $('.' + namespace + 'direction-nav li a', slider.controlsContainer);
          } else {
            slider.append(directionNavScaffold);
            slider.directionNav = $('.' + namespace + 'direction-nav li a', slider);
          }

          methods.directionNav.update();

          slider.directionNav.bind(eventType, function(event) {
            event.preventDefault();
            var target;

            if (watchedEvent === "" || watchedEvent === event.type) {
              target = ($(this).hasClass(namespace + 'next')) ? slider.getTarget('next') : slider.getTarget('prev');
              slider.flexAnimate(target, slider.vars.pauseOnAction);
            }

            // setup flags to prevent event duplication
            if (watchedEvent === "") {
              watchedEvent = event.type;
            }
            methods.setToClearWatchedEvent();
          });
        },
        update: function() {
          var disabledClass = namespace + 'disabled';
          if (slider.pagingCount === 1) {
            slider.directionNav.addClass(disabledClass).attr('tabindex', '-1');
          } else if (!slider.vars.animationLoop) {
            if (slider.animatingTo === 0) {
              slider.directionNav.removeClass(disabledClass).filter('.' + namespace + "prev").addClass(disabledClass).attr('tabindex', '-1');
            } else if (slider.animatingTo === slider.last) {
              slider.directionNav.removeClass(disabledClass).filter('.' + namespace + "next").addClass(disabledClass).attr('tabindex', '-1');
            } else {
              slider.directionNav.removeClass(disabledClass).removeAttr('tabindex');
            }
          } else {
            slider.directionNav.removeClass(disabledClass).removeAttr('tabindex');
          }
        }
      },
      pausePlay: {
        setup: function() {
          var pausePlayScaffold = $('<div class="' + namespace + 'pauseplay"><a></a></div>');

          // CONTROLSCONTAINER:
          if (slider.controlsContainer) {
            slider.controlsContainer.append(pausePlayScaffold);
            slider.pausePlay = $('.' + namespace + 'pauseplay a', slider.controlsContainer);
          } else {
            slider.append(pausePlayScaffold);
            slider.pausePlay = $('.' + namespace + 'pauseplay a', slider);
          }

          methods.pausePlay.update((slider.vars.slideshow) ? namespace + 'pause' : namespace + 'play');

          slider.pausePlay.bind(eventType, function(event) {
            event.preventDefault();

            if (watchedEvent === "" || watchedEvent === event.type) {
              if ($(this).hasClass(namespace + 'pause')) {
                slider.manualPause = true;
                slider.manualPlay = false;
                slider.pause();
              } else {
                slider.manualPause = false;
                slider.manualPlay = true;
                slider.play();
              }
            }

            // setup flags to prevent event duplication
            if (watchedEvent === "") {
              watchedEvent = event.type;
            }
            methods.setToClearWatchedEvent();
          });
        },
        update: function(state) {
          (state === "play") ? slider.pausePlay.removeClass(namespace + 'pause').addClass(namespace + 'play').html(slider.vars.playText) : slider.pausePlay.removeClass(namespace + 'play').addClass(namespace + 'pause').html(slider.vars.pauseText);
        }
      },
      touch: function() {
        var startX,
          startY,
          offset,
          cwidth,
          dx,
          startT,
          scrolling = false,
          localX = 0,
          localY = 0,
          accDx = 0;

        if(!msGesture){
            el.addEventListener('touchstart', onTouchStart, false);

            function onTouchStart(e) {
              if (slider.animating) {
                e.preventDefault();
              } else if ( ( window.navigator.msPointerEnabled ) || e.touches.length === 1 ) {
                slider.pause();
                // CAROUSEL:
                cwidth = (vertical) ? slider.h : slider. w;
                startT = Number(new Date());
                // CAROUSEL:

                // Local vars for X and Y points.
                localX = e.touches[0].pageX;
                localY = e.touches[0].pageY;

                offset = (carousel && reverse && slider.animatingTo === slider.last) ? 0 :
                         (carousel && reverse) ? slider.limit - (((slider.itemW + slider.vars.itemMargin) * slider.move) * slider.animatingTo) :
                         (carousel && slider.currentSlide === slider.last) ? slider.limit :
                         (carousel) ? ((slider.itemW + slider.vars.itemMargin) * slider.move) * slider.currentSlide :
                         (reverse) ? (slider.last - slider.currentSlide + slider.cloneOffset) * cwidth : (slider.currentSlide + slider.cloneOffset) * cwidth;
                startX = (vertical) ? localY : localX;
                startY = (vertical) ? localX : localY;

                el.addEventListener('touchmove', onTouchMove, false);
                el.addEventListener('touchend', onTouchEnd, false);
              }
            }

            function onTouchMove(e) {
              // Local vars for X and Y points.

              localX = e.touches[0].pageX;
              localY = e.touches[0].pageY;

              dx = (vertical) ? startX - localY : startX - localX;
              scrolling = (vertical) ? (Math.abs(dx) < Math.abs(localX - startY)) : (Math.abs(dx) < Math.abs(localY - startY));

              var fxms = 500;

              if ( ! scrolling || Number( new Date() ) - startT > fxms ) {
                e.preventDefault();
                if (!fade && slider.transitions) {
                  if (!slider.vars.animationLoop) {
                    dx = dx/((slider.currentSlide === 0 && dx < 0 || slider.currentSlide === slider.last && dx > 0) ? (Math.abs(dx)/cwidth+2) : 1);
                  }
                  slider.setProps(offset + dx, "setTouch");
                }
              }
            }

            function onTouchEnd(e) {
              // finish the touch by undoing the touch session
              el.removeEventListener('touchmove', onTouchMove, false);

              if (slider.animatingTo === slider.currentSlide && !scrolling && !(dx === null)) {
                var updateDx = (reverse) ? -dx : dx,
                    target = (updateDx > 0) ? slider.getTarget('next') : slider.getTarget('prev');

                if (slider.canAdvance(target) && (Number(new Date()) - startT < 550 && Math.abs(updateDx) > 50 || Math.abs(updateDx) > cwidth/2)) {
                  slider.flexAnimate(target, slider.vars.pauseOnAction);
                } else {
                  if (!fade) slider.flexAnimate(slider.currentSlide, slider.vars.pauseOnAction, true);
                }
              }
              el.removeEventListener('touchend', onTouchEnd, false);

              startX = null;
              startY = null;
              dx = null;
              offset = null;
            }
        }else{
            el.style.msTouchAction = "none";
            el._gesture = new MSGesture();
            el._gesture.target = el;
            el.addEventListener("MSPointerDown", onMSPointerDown, false);
            el._slider = slider;
            el.addEventListener("MSGestureChange", onMSGestureChange, false);
            el.addEventListener("MSGestureEnd", onMSGestureEnd, false);

            function onMSPointerDown(e){
                e.stopPropagation();
                if (slider.animating) {
                    e.preventDefault();
                }else{
                    slider.pause();
                    el._gesture.addPointer(e.pointerId);
                    accDx = 0;
                    cwidth = (vertical) ? slider.h : slider. w;
                    startT = Number(new Date());
                    // CAROUSEL:

                    offset = (carousel && reverse && slider.animatingTo === slider.last) ? 0 :
                        (carousel && reverse) ? slider.limit - (((slider.itemW + slider.vars.itemMargin) * slider.move) * slider.animatingTo) :
                            (carousel && slider.currentSlide === slider.last) ? slider.limit :
                                (carousel) ? ((slider.itemW + slider.vars.itemMargin) * slider.move) * slider.currentSlide :
                                    (reverse) ? (slider.last - slider.currentSlide + slider.cloneOffset) * cwidth : (slider.currentSlide + slider.cloneOffset) * cwidth;
                }
            }

            function onMSGestureChange(e) {
                e.stopPropagation();
                var slider = e.target._slider;
                if(!slider){
                    return;
                }
                var transX = -e.translationX,
                    transY = -e.translationY;

                //Accumulate translations.
                accDx = accDx + ((vertical) ? transY : transX);
                dx = accDx;
                scrolling = (vertical) ? (Math.abs(accDx) < Math.abs(-transX)) : (Math.abs(accDx) < Math.abs(-transY));

                if(e.detail === e.MSGESTURE_FLAG_INERTIA){
                    setImmediate(function (){
                        el._gesture.stop();
                    });

                    return;
                }

                if (!scrolling || Number(new Date()) - startT > 500) {
                    e.preventDefault();
                    if (!fade && slider.transitions) {
                        if (!slider.vars.animationLoop) {
                            dx = accDx / ((slider.currentSlide === 0 && accDx < 0 || slider.currentSlide === slider.last && accDx > 0) ? (Math.abs(accDx) / cwidth + 2) : 1);
                        }
                        slider.setProps(offset + dx, "setTouch");
                    }
                }
            }

            function onMSGestureEnd(e) {
                e.stopPropagation();
                var slider = e.target._slider;
                if(!slider){
                    return;
                }
                if (slider.animatingTo === slider.currentSlide && !scrolling && !(dx === null)) {
                    var updateDx = (reverse) ? -dx : dx,
                        target = (updateDx > 0) ? slider.getTarget('next') : slider.getTarget('prev');

                    if (slider.canAdvance(target) && (Number(new Date()) - startT < 550 && Math.abs(updateDx) > 50 || Math.abs(updateDx) > cwidth/2)) {
                        slider.flexAnimate(target, slider.vars.pauseOnAction);
                    } else {
                        if (!fade) slider.flexAnimate(slider.currentSlide, slider.vars.pauseOnAction, true);
                    }
                }

                startX = null;
                startY = null;
                dx = null;
                offset = null;
                accDx = 0;
            }
        }
      },
      resize: function() {
        if (!slider.animating && slider.is(':visible')) {
          if (!carousel) slider.doMath();

          if (fade) {
            // SMOOTH HEIGHT:
            methods.smoothHeight();
          } else if (carousel) { //CAROUSEL:
            slider.slides.width(slider.computedW);
            slider.update(slider.pagingCount);
            slider.setProps();
          }
          else if (vertical) { //VERTICAL:
            slider.viewport.height(slider.h);
            slider.setProps(slider.h, "setTotal");
          } else {
            // SMOOTH HEIGHT:
            if (slider.vars.smoothHeight) methods.smoothHeight();
            slider.newSlides.width(slider.computedW);
            slider.setProps(slider.computedW, "setTotal");
          }
        }
      },
      smoothHeight: function(dur) {
        if (!vertical || fade) {
          var $obj = (fade) ? slider : slider.viewport;
          (dur) ? $obj.animate({"height": slider.slides.eq(slider.animatingTo).height()}, dur) : $obj.height(slider.slides.eq(slider.animatingTo).height());
        }
      },
      sync: function(action) {
        var $obj = $(slider.vars.sync).data("flexslider"),
            target = slider.animatingTo;

        switch (action) {
          case "animate": $obj.flexAnimate(target, slider.vars.pauseOnAction, false, true); break;
          case "play": if (!$obj.playing && !$obj.asNav) { $obj.play(); } break;
          case "pause": $obj.pause(); break;
        }
      },
      uniqueID: function($clone) {
        // Append _clone to current level and children elements with id attributes
        $clone.filter( '[id]' ).add($clone.find( '[id]' )).each(function() {
          var $this = $(this);
          $this.attr( 'id', $this.attr( 'id' ) + '_clone' );
        });
        return $clone;
      },
      pauseInvisible: {
        visProp: null,
        init: function() {
          var prefixes = ['webkit','moz','ms','o'];

          if ('hidden' in document) return 'hidden';
          for (var i = 0; i < prefixes.length; i++) {
            if ((prefixes[i] + 'Hidden') in document)
            methods.pauseInvisible.visProp = prefixes[i] + 'Hidden';
          }
          if (methods.pauseInvisible.visProp) {
            var evtname = methods.pauseInvisible.visProp.replace(/[H|h]idden/,'') + 'visibilitychange';
            document.addEventListener(evtname, function() {
              if (methods.pauseInvisible.isHidden()) {
                if(slider.startTimeout) clearTimeout(slider.startTimeout); //If clock is ticking, stop timer and prevent from starting while invisible
                else slider.pause(); //Or just pause
              }
              else {
                if(slider.started) slider.play(); //Initiated before, just play
                else (slider.vars.initDelay > 0) ? setTimeout(slider.play, slider.vars.initDelay) : slider.play(); //Didn't init before: simply init or wait for it
              }
            });
          }
        },
        isHidden: function() {
          return document[methods.pauseInvisible.visProp] || false;
        }
      },
      setToClearWatchedEvent: function() {
        clearTimeout(watchedEventClearTimer);
        watchedEventClearTimer = setTimeout(function() {
          watchedEvent = "";
        }, 3000);
      }
    };

    // public methods
    slider.flexAnimate = function(target, pause, override, withSync, fromNav) {
      if (!slider.vars.animationLoop && target !== slider.currentSlide) {
        slider.direction = (target > slider.currentSlide) ? "next" : "prev";
      }

      if (asNav && slider.pagingCount === 1) slider.direction = (slider.currentItem < target) ? "next" : "prev";

      if (!slider.animating && (slider.canAdvance(target, fromNav) || override) && slider.is(":visible")) {
        if (asNav && withSync) {
          var master = $(slider.vars.asNavFor).data('flexslider');
          slider.atEnd = target === 0 || target === slider.count - 1;
          master.flexAnimate(target, true, false, true, fromNav);
          slider.direction = (slider.currentItem < target) ? "next" : "prev";
          master.direction = slider.direction;

          if (Math.ceil((target + 1)/slider.visible) - 1 !== slider.currentSlide && target !== 0) {
            slider.currentItem = target;
            slider.slides.removeClass(namespace + "active-slide").eq(target).addClass(namespace + "active-slide");
            target = Math.floor(target/slider.visible);
          } else {
            slider.currentItem = target;
            slider.slides.removeClass(namespace + "active-slide").eq(target).addClass(namespace + "active-slide");
            return false;
          }
        }

        slider.animating = true;
        slider.animatingTo = target;

        // SLIDESHOW:
        if (pause) slider.pause();

        // API: before() animation Callback
        slider.vars.before(slider);

        // SYNC:
        if (slider.syncExists && !fromNav) methods.sync("animate");

        // CONTROLNAV
        if (slider.vars.controlNav) methods.controlNav.active();

        // !CAROUSEL:
        // CANDIDATE: slide active class (for add/remove slide)
        if (!carousel) slider.slides.removeClass(namespace + 'active-slide').eq(target).addClass(namespace + 'active-slide');

        // INFINITE LOOP:
        // CANDIDATE: atEnd
        slider.atEnd = target === 0 || target === slider.last;

        // DIRECTIONNAV:
        if (slider.vars.directionNav) methods.directionNav.update();

        if (target === slider.last) {
          // API: end() of cycle Callback
          slider.vars.end(slider);
          // SLIDESHOW && !INFINITE LOOP:
          if (!slider.vars.animationLoop) slider.pause();
        }

        // SLIDE:
        if (!fade) {
          var dimension = (vertical) ? slider.slides.filter(':first').height() : slider.computedW,
              margin, slideString, calcNext;

          // INFINITE LOOP / REVERSE:
          if (carousel) {
            //margin = (slider.vars.itemWidth > slider.w) ? slider.vars.itemMargin * 2 : slider.vars.itemMargin;
            margin = slider.vars.itemMargin;
            calcNext = ((slider.itemW + margin) * slider.move) * slider.animatingTo;
            slideString = (calcNext > slider.limit && slider.visible !== 1) ? slider.limit : calcNext;
          } else if (slider.currentSlide === 0 && target === slider.count - 1 && slider.vars.animationLoop && slider.direction !== "next") {
            slideString = (reverse) ? (slider.count + slider.cloneOffset) * dimension : 0;
          } else if (slider.currentSlide === slider.last && target === 0 && slider.vars.animationLoop && slider.direction !== "prev") {
            slideString = (reverse) ? 0 : (slider.count + 1) * dimension;
          } else {
            slideString = (reverse) ? ((slider.count - 1) - target + slider.cloneOffset) * dimension : (target + slider.cloneOffset) * dimension;
          }
          slider.setProps(slideString, "", slider.vars.animationSpeed);
          if (slider.transitions) {
            if (!slider.vars.animationLoop || !slider.atEnd) {
              slider.animating = false;
              slider.currentSlide = slider.animatingTo;
            }
            
            // Unbind previous transitionEnd events and re-bind new transitionEnd event
            slider.container.unbind("webkitTransitionEnd transitionend");
            slider.container.bind("webkitTransitionEnd transitionend", function() {
              clearTimeout(slider.ensureAnimationEnd);
              slider.wrapup(dimension);
            });

            // Insurance for the ever-so-fickle transitionEnd event
            clearTimeout(slider.ensureAnimationEnd);
            slider.ensureAnimationEnd = setTimeout(function() {
              slider.wrapup(dimension);
            }, slider.vars.animationSpeed + 100);

          } else {
            slider.container.animate(slider.args, slider.vars.animationSpeed, slider.vars.easing, function(){
              slider.wrapup(dimension);
            });
          }
        } else { // FADE:
          if (!touch) {
            //slider.slides.eq(slider.currentSlide).fadeOut(slider.vars.animationSpeed, slider.vars.easing);
            //slider.slides.eq(target).fadeIn(slider.vars.animationSpeed, slider.vars.easing, slider.wrapup);

            slider.slides.eq(slider.currentSlide).css({"zIndex": 1}).animate({"opacity": 0}, slider.vars.animationSpeed, slider.vars.easing);
            slider.slides.eq(target).css({"zIndex": 2}).animate({"opacity": 1}, slider.vars.animationSpeed, slider.vars.easing, slider.wrapup);

          } else {
            slider.slides.eq(slider.currentSlide).css({ "opacity": 0, "zIndex": 1 });
            slider.slides.eq(target).css({ "opacity": 1, "zIndex": 2 });
            slider.wrapup(dimension);
          }
        }
        // SMOOTH HEIGHT:
        if (slider.vars.smoothHeight) methods.smoothHeight(slider.vars.animationSpeed);
      }
    };
    slider.wrapup = function(dimension) {
      // SLIDE:
      if (!fade && !carousel) {
        if (slider.currentSlide === 0 && slider.animatingTo === slider.last && slider.vars.animationLoop) {
          slider.setProps(dimension, "jumpEnd");
        } else if (slider.currentSlide === slider.last && slider.animatingTo === 0 && slider.vars.animationLoop) {
          slider.setProps(dimension, "jumpStart");
        }
      }
      slider.animating = false;
      slider.currentSlide = slider.animatingTo;
      // API: after() animation Callback
      slider.vars.after(slider);
    };

    // SLIDESHOW:
    slider.animateSlides = function() {
      if (!slider.animating && focused ) slider.flexAnimate(slider.getTarget("next"));
    };
    // SLIDESHOW:
    slider.pause = function() {
      clearInterval(slider.animatedSlides);
      slider.animatedSlides = null;
      slider.playing = false;
      // PAUSEPLAY:
      if (slider.vars.pausePlay) methods.pausePlay.update("play");
      // SYNC:
      if (slider.syncExists) methods.sync("pause");
    };
    // SLIDESHOW:
    slider.play = function() {
      if (slider.playing) clearInterval(slider.animatedSlides);
      slider.animatedSlides = slider.animatedSlides || setInterval(slider.animateSlides, slider.vars.slideshowSpeed);
      slider.started = slider.playing = true;
      // PAUSEPLAY:
      if (slider.vars.pausePlay) methods.pausePlay.update("pause");
      // SYNC:
      if (slider.syncExists) methods.sync("play");
    };
    // STOP:
    slider.stop = function () {
      slider.pause();
      slider.stopped = true;
    };
    slider.canAdvance = function(target, fromNav) {
      // ASNAV:
      var last = (asNav) ? slider.pagingCount - 1 : slider.last;
      return (fromNav) ? true :
             (asNav && slider.currentItem === slider.count - 1 && target === 0 && slider.direction === "prev") ? true :
             (asNav && slider.currentItem === 0 && target === slider.pagingCount - 1 && slider.direction !== "next") ? false :
             (target === slider.currentSlide && !asNav) ? false :
             (slider.vars.animationLoop) ? true :
             (slider.atEnd && slider.currentSlide === 0 && target === last && slider.direction !== "next") ? false :
             (slider.atEnd && slider.currentSlide === last && target === 0 && slider.direction === "next") ? false :
             true;
    };
    slider.getTarget = function(dir) {
      slider.direction = dir;
      if (dir === "next") {
        return (slider.currentSlide === slider.last) ? 0 : slider.currentSlide + 1;
      } else {
        return (slider.currentSlide === 0) ? slider.last : slider.currentSlide - 1;
      }
    };

    // SLIDE:
    slider.setProps = function(pos, special, dur) {
      var target = (function() {
        var posCheck = (pos) ? pos : ((slider.itemW + slider.vars.itemMargin) * slider.move) * slider.animatingTo,
            posCalc = (function() {
              if (carousel) {
                return (special === "setTouch") ? pos :
                       (reverse && slider.animatingTo === slider.last) ? 0 :
                       (reverse) ? slider.limit - (((slider.itemW + slider.vars.itemMargin) * slider.move) * slider.animatingTo) :
                       (slider.animatingTo === slider.last) ? slider.limit : posCheck;
              } else {
                switch (special) {
                  case "setTotal": return (reverse) ? ((slider.count - 1) - slider.currentSlide + slider.cloneOffset) * pos : (slider.currentSlide + slider.cloneOffset) * pos;
                  case "setTouch": return (reverse) ? pos : pos;
                  case "jumpEnd": return (reverse) ? pos : slider.count * pos;
                  case "jumpStart": return (reverse) ? slider.count * pos : pos;
                  default: return pos;
                }
              }
            }());

            return (posCalc * -1) + "px";
          }());

      if (slider.transitions) {
        target = (vertical) ? "translate3d(0," + target + ",0)" : "translate3d(" + target + ",0,0)";
        dur = (dur !== undefined) ? (dur/1000) + "s" : "0s";
        slider.container.css("-" + slider.pfx + "-transition-duration", dur);
         slider.container.css("transition-duration", dur);
      }

      slider.args[slider.prop] = target;
      if (slider.transitions || dur === undefined) slider.container.css(slider.args);

      slider.container.css('transform',target);
    };

    slider.setup = function(type) {
      // SLIDE:
      if (!fade) {
        var sliderOffset, arr;

        if (type === "init") {
          slider.viewport = $('<div class="' + namespace + 'viewport"></div>').css({"overflow": "hidden", "position": "relative"}).appendTo(slider).append(slider.container);
          // INFINITE LOOP:
          slider.cloneCount = 0;
          slider.cloneOffset = 0;
          // REVERSE:
          if (reverse) {
            arr = $.makeArray(slider.slides).reverse();
            slider.slides = $(arr);
            slider.container.empty().append(slider.slides);
          }
        }
        // INFINITE LOOP && !CAROUSEL:
        if (slider.vars.animationLoop && !carousel) {
          slider.cloneCount = 2;
          slider.cloneOffset = 1;
          // clear out old clones
          if (type !== "init") slider.container.find('.clone').remove();
          slider.container.append(methods.uniqueID(slider.slides.first().clone().addClass('clone')).attr('aria-hidden', 'true'))
                          .prepend(methods.uniqueID(slider.slides.last().clone().addClass('clone')).attr('aria-hidden', 'true'));
        }
        slider.newSlides = $(slider.vars.selector, slider);

        sliderOffset = (reverse) ? slider.count - 1 - slider.currentSlide + slider.cloneOffset : slider.currentSlide + slider.cloneOffset;
        // VERTICAL:
        if (vertical && !carousel) {
          slider.container.height((slider.count + slider.cloneCount) * 200 + "%").css("position", "absolute").width("100%");
          setTimeout(function(){
            slider.newSlides.css({"display": "block"});
            slider.doMath();
            slider.viewport.height(slider.h);
            slider.setProps(sliderOffset * slider.h, "init");
          }, (type === "init") ? 100 : 0);
        } else {
          slider.container.width((slider.count + slider.cloneCount) * 200 + "%");
          slider.setProps(sliderOffset * slider.computedW, "init");
          setTimeout(function(){
            slider.doMath();
            slider.newSlides.css({"width": slider.computedW, "float": "left", "display": "block"});
            // SMOOTH HEIGHT:
            if (slider.vars.smoothHeight) methods.smoothHeight();
          }, (type === "init") ? 100 : 0);
        }
      } else { // FADE:
        slider.slides.css({"width": "100%", "float": "left", "marginRight": "-100%", "position": "relative"});
        if (type === "init") {
          if (!touch) {
            //slider.slides.eq(slider.currentSlide).fadeIn(slider.vars.animationSpeed, slider.vars.easing);
            if (slider.vars.fadeFirstSlide == false) {
              slider.slides.css({ "opacity": 0, "display": "block", "zIndex": 1 }).eq(slider.currentSlide).css({"zIndex": 2}).css({"opacity": 1});
            } else {
              slider.slides.css({ "opacity": 0, "display": "block", "zIndex": 1 }).eq(slider.currentSlide).css({"zIndex": 2}).animate({"opacity": 1},slider.vars.animationSpeed,slider.vars.easing);
            }
          } else {
            slider.slides.css({ "opacity": 0, "display": "block", "webkitTransition": "opacity " + slider.vars.animationSpeed / 1000 + "s ease", "zIndex": 1 }).eq(slider.currentSlide).css({ "opacity": 1, "zIndex": 2});
          }
        }
        // SMOOTH HEIGHT:
        if (slider.vars.smoothHeight) methods.smoothHeight();
      }
      // !CAROUSEL:
      // CANDIDATE: active slide
      if (!carousel) slider.slides.removeClass(namespace + "active-slide").eq(slider.currentSlide).addClass(namespace + "active-slide");

      //FlexSlider: init() Callback
      slider.vars.init(slider);
    };

    slider.doMath = function() {
      var slide = slider.slides.first(),
          slideMargin = slider.vars.itemMargin,
          minItems = slider.vars.minItems,
          maxItems = slider.vars.maxItems;

      slider.w = (slider.viewport===undefined) ? slider.width() : slider.viewport.width();
      slider.h = slide.height();
      slider.boxPadding = slide.outerWidth() - slide.width();

      // CAROUSEL:
      if (carousel) {
        slider.itemT = slider.vars.itemWidth + slideMargin;
        slider.minW = (minItems) ? minItems * slider.itemT : slider.w;
        slider.maxW = (maxItems) ? (maxItems * slider.itemT) - slideMargin : slider.w;
        slider.itemW = (slider.minW > slider.w) ? (slider.w - (slideMargin * (minItems - 1)))/minItems :
                       (slider.maxW < slider.w) ? (slider.w - (slideMargin * (maxItems - 1)))/maxItems :
                       (slider.vars.itemWidth > slider.w) ? slider.w : slider.vars.itemWidth;

        slider.visible = Math.floor(slider.w/(slider.itemW));
        slider.move = (slider.vars.move > 0 && slider.vars.move < slider.visible ) ? slider.vars.move : slider.visible;
        slider.pagingCount = Math.ceil(((slider.count - slider.visible)/slider.move) + 1);
        slider.last =  slider.pagingCount - 1;
        slider.limit = (slider.pagingCount === 1) ? 0 :
                       (slider.vars.itemWidth > slider.w) ? (slider.itemW * (slider.count - 1)) + (slideMargin * (slider.count - 1)) : ((slider.itemW + slideMargin) * slider.count) - slider.w - slideMargin;
      } else {
        slider.itemW = slider.w;
        slider.pagingCount = slider.count;
        slider.last = slider.count - 1;
      }
      slider.computedW = slider.itemW - slider.boxPadding;
    };

    slider.update = function(pos, action) {
      slider.doMath();

      // update currentSlide and slider.animatingTo if necessary
      if (!carousel) {
        if (pos < slider.currentSlide) {
          slider.currentSlide += 1;
        } else if (pos <= slider.currentSlide && pos !== 0) {
          slider.currentSlide -= 1;
        }
        slider.animatingTo = slider.currentSlide;
      }

      // update controlNav
      if (slider.vars.controlNav && !slider.manualControls) {
        if ((action === "add" && !carousel) || slider.pagingCount > slider.controlNav.length) {
          methods.controlNav.update("add");
        } else if ((action === "remove" && !carousel) || slider.pagingCount < slider.controlNav.length) {
          if (carousel && slider.currentSlide > slider.last) {
            slider.currentSlide -= 1;
            slider.animatingTo -= 1;
          }
          methods.controlNav.update("remove", slider.last);
        }
      }
      // update directionNav
      if (slider.vars.directionNav) methods.directionNav.update();

    };

    slider.addSlide = function(obj, pos) {
      var $obj = $(obj);

      slider.count += 1;
      slider.last = slider.count - 1;

      // append new slide
      if (vertical && reverse) {
        (pos !== undefined) ? slider.slides.eq(slider.count - pos).after($obj) : slider.container.prepend($obj);
      } else {
        (pos !== undefined) ? slider.slides.eq(pos).before($obj) : slider.container.append($obj);
      }

      // update currentSlide, animatingTo, controlNav, and directionNav
      slider.update(pos, "add");

      // update slider.slides
      slider.slides = $(slider.vars.selector + ':not(.clone)', slider);
      // re-setup the slider to accomdate new slide
      slider.setup();

      //FlexSlider: added() Callback
      slider.vars.added(slider);
    };
    slider.removeSlide = function(obj) {
      var pos = (isNaN(obj)) ? slider.slides.index($(obj)) : obj;

      // update count
      slider.count -= 1;
      slider.last = slider.count - 1;

      // remove slide
      if (isNaN(obj)) {
        $(obj, slider.slides).remove();
      } else {
        (vertical && reverse) ? slider.slides.eq(slider.last).remove() : slider.slides.eq(obj).remove();
      }

      // update currentSlide, animatingTo, controlNav, and directionNav
      slider.doMath();
      slider.update(pos, "remove");

      // update slider.slides
      slider.slides = $(slider.vars.selector + ':not(.clone)', slider);
      // re-setup the slider to accomdate new slide
      slider.setup();

      // FlexSlider: removed() Callback
      slider.vars.removed(slider);
    };

    //FlexSlider: Initialize
    methods.init();
  };

  // Ensure the slider isn't focussed if the window loses focus.
  $( window ).blur( function ( e ) {
    focused = false;
  }).focus( function ( e ) {
    focused = true;
  });

  //FlexSlider: Default Settings
  $.flexslider.defaults = {
    namespace: "flex-",             //{NEW} String: Prefix string attached to the class of every element generated by the plugin
    selector: ".slides > li",       //{NEW} Selector: Must match a simple pattern. '{container} > {slide}' -- Ignore pattern at your own peril
    animation: "fade",              //String: Select your animation type, "fade" or "slide"
    easing: "swing",                //{NEW} String: Determines the easing method used in jQuery transitions. jQuery easing plugin is supported!
    direction: "horizontal",        //String: Select the sliding direction, "horizontal" or "vertical"
    reverse: false,                 //{NEW} Boolean: Reverse the animation direction
    animationLoop: true,            //Boolean: Should the animation loop? If false, directionNav will received "disable" classes at either end
    smoothHeight: false,            //{NEW} Boolean: Allow height of the slider to animate smoothly in horizontal mode
    startAt: 0,                     //Integer: The slide that the slider should start on. Array notation (0 = first slide)
    slideshow: true,                //Boolean: Animate slider automatically
    slideshowSpeed: 7000,           //Integer: Set the speed of the slideshow cycling, in milliseconds
    animationSpeed: 600,            //Integer: Set the speed of animations, in milliseconds
    initDelay: 0,                   //{NEW} Integer: Set an initialization delay, in milliseconds
    randomize: false,               //Boolean: Randomize slide order
    fadeFirstSlide: true,           //Boolean: Fade in the first slide when animation type is "fade"
    thumbCaptions: false,           //Boolean: Whether or not to put captions on thumbnails when using the "thumbnails" controlNav.

    // Usability features
    pauseOnAction: true,            //Boolean: Pause the slideshow when interacting with control elements, highly recommended.
    pauseOnHover: false,            //Boolean: Pause the slideshow when hovering over slider, then resume when no longer hovering
    pauseInvisible: true,       //{NEW} Boolean: Pause the slideshow when tab is invisible, resume when visible. Provides better UX, lower CPU usage.
    useCSS: true,                   //{NEW} Boolean: Slider will use CSS3 transitions if available
    touch: true,                    //{NEW} Boolean: Allow touch swipe navigation of the slider on touch-enabled devices
    video: false,                   //{NEW} Boolean: If using video in the slider, will prevent CSS3 3D Transforms to avoid graphical glitches

    // Primary Controls
    controlNav: true,               //Boolean: Create navigation for paging control of each slide? Note: Leave true for manualControls usage
    directionNav: true,             //Boolean: Create navigation for previous/next navigation? (true/false)
    prevText: "Previous",           //String: Set the text for the "previous" directionNav item
    nextText: "Next",               //String: Set the text for the "next" directionNav item

    // Secondary Navigation
    keyboard: true,                 //Boolean: Allow slider navigating via keyboard left/right keys
    multipleKeyboard: false,        //{NEW} Boolean: Allow keyboard navigation to affect multiple sliders. Default behavior cuts out keyboard navigation with more than one slider present.
    mousewheel: false,              //{UPDATED} Boolean: Requires jquery.mousewheel.js (https://github.com/brandonaaron/jquery-mousewheel) - Allows slider navigating via mousewheel
    pausePlay: false,               //Boolean: Create pause/play dynamic element
    pauseText: "Pause",             //String: Set the text for the "pause" pausePlay item
    playText: "Play",               //String: Set the text for the "play" pausePlay item

    // Special properties
    controlsContainer: "",          //{UPDATED} jQuery Object/Selector: Declare which container the navigation elements should be appended too. Default container is the FlexSlider element. Example use would be $(".flexslider-container"). Property is ignored if given element is not found.
    manualControls: "",             //{UPDATED} jQuery Object/Selector: Declare custom control navigation. Examples would be $(".flex-control-nav li") or "#tabs-nav li img", etc. The number of elements in your controlNav should match the number of slides/tabs.
    sync: "",                       //{NEW} Selector: Mirror the actions performed on this slider with another slider. Use with care.
    asNavFor: "",                   //{NEW} Selector: Internal property exposed for turning the slider into a thumbnail navigation for another slider

    // Carousel Options
    itemWidth: 0,                   //{NEW} Integer: Box-model width of individual carousel items, including horizontal borders and padding.
    itemMargin: 0,                  //{NEW} Integer: Margin between carousel items.
    minItems: 1,                    //{NEW} Integer: Minimum number of carousel items that should be visible. Items will resize fluidly when below this.
    maxItems: 0,                    //{NEW} Integer: Maxmimum number of carousel items that should be visible. Items will resize fluidly when above this limit.
    move: 0,                        //{NEW} Integer: Number of carousel items that should move on animation. If 0, slider will move all visible items.
    allowOneSlide: true,           //{NEW} Boolean: Whether or not to allow a slider comprised of a single slide

    // Callback API
    start: function(){},            //Callback: function(slider) - Fires when the slider loads the first slide
    before: function(){},           //Callback: function(slider) - Fires asynchronously with each slider animation
    after: function(){},            //Callback: function(slider) - Fires after each slider animation completes
    end: function(){},              //Callback: function(slider) - Fires when the slider reaches the last slide (asynchronous)
    added: function(){},            //{NEW} Callback: function(slider) - Fires after a slide is added
    removed: function(){},           //{NEW} Callback: function(slider) - Fires after a slide is removed
    init: function() {}             //{NEW} Callback: function(slider) - Fires after the slider is initially setup
  };

  //FlexSlider: Plugin Function
  $.fn.flexslider = function(options) {
    if (options === undefined) options = {};

    if (typeof options === "object") {
      return this.each(function() {
        var $this = $(this),
            selector = (options.selector) ? options.selector : ".slides > li",
            $slides = $this.find(selector);

      if ( ( $slides.length === 1 && options.allowOneSlide === true ) || $slides.length === 0 ) {
          $slides.fadeIn(400);
          if (options.start) options.start($this);
        } else if ($this.data('flexslider') === undefined) {
          new $.flexslider(this, options);
        }
      });
    } else {
      // Helper strings to quickly perform functions on the slider
      var $slider = $(this).data('flexslider');
      switch (options) {
        case "play": $slider.play(); break;
        case "pause": $slider.pause(); break;
        case "stop": $slider.stop(); break;
        case "next": $slider.flexAnimate($slider.getTarget("next"), true); break;
        case "prev":
        case "previous": $slider.flexAnimate($slider.getTarget("prev"), true); break;
        default: if (typeof options === "number") $slider.flexAnimate(options, true);
      }
    }
  };
  
$(document).ready(function(){
  if ($('.hometexts').length > 0) {
    $('.hometexts').flexslider({
      animation: "slide",
      selector: "ul li",
      controlNav: false,
      directionNav: false ,
      slideshowSpeed: 4000,  
      direction: "vertical"
    });
  }
})

})(jQuery);
;
(function($) {
	"use strict";
	
	$(document).ready(function () {

			if( $('.data_background').length && $('.data_background').attr("data-image-src")) {
				$( '.data_background' ).each(function(){
					$(this).css("background-image", "url(" + $(this).data("image-src") + ")");
				});
			}
			
	});
	
})(jQuery);;
/*!
 * Bootstrap v3.3.0 (http://getbootstrap.com)
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */
if("undefined"==typeof jQuery)throw new Error("Bootstrap's JavaScript requires jQuery");+function(a){var b=a.fn.jquery.split(" ")[0].split(".");if(b[0]<2&&b[1]<9||1==b[0]&&9==b[1]&&b[2]<1)throw new Error("Bootstrap's JavaScript requires jQuery version 1.9.1 or higher")}(jQuery),+function(a){"use strict";function b(){var a=document.createElement("bootstrap"),b={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(var c in b)if(void 0!==a.style[c])return{end:b[c]};return!1}a.fn.emulateTransitionEnd=function(b){var c=!1,d=this;a(this).one("bsTransitionEnd",function(){c=!0});var e=function(){c||a(d).trigger(a.support.transition.end)};return setTimeout(e,b),this},a(function(){a.support.transition=b(),a.support.transition&&(a.event.special.bsTransitionEnd={bindType:a.support.transition.end,delegateType:a.support.transition.end,handle:function(b){return a(b.target).is(this)?b.handleObj.handler.apply(this,arguments):void 0}})})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var c=a(this),e=c.data("bs.alert");e||c.data("bs.alert",e=new d(this)),"string"==typeof b&&e[b].call(c)})}var c='[data-dismiss="alert"]',d=function(b){a(b).on("click",c,this.close)};d.VERSION="3.3.0",d.TRANSITION_DURATION=150,d.prototype.close=function(b){function c(){g.detach().trigger("closed.bs.alert").remove()}var e=a(this),f=e.attr("data-target");f||(f=e.attr("href"),f=f&&f.replace(/.*(?=#[^\s]*$)/,""));var g=a(f);b&&b.preventDefault(),g.length||(g=e.closest(".alert")),g.trigger(b=a.Event("close.bs.alert")),b.isDefaultPrevented()||(g.removeClass("in"),a.support.transition&&g.hasClass("fade")?g.one("bsTransitionEnd",c).emulateTransitionEnd(d.TRANSITION_DURATION):c())};var e=a.fn.alert;a.fn.alert=b,a.fn.alert.Constructor=d,a.fn.alert.noConflict=function(){return a.fn.alert=e,this},a(document).on("click.bs.alert.data-api",c,d.prototype.close)}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.button"),f="object"==typeof b&&b;e||d.data("bs.button",e=new c(this,f)),"toggle"==b?e.toggle():b&&e.setState(b)})}var c=function(b,d){this.$element=a(b),this.options=a.extend({},c.DEFAULTS,d),this.isLoading=!1};c.VERSION="3.3.0",c.DEFAULTS={loadingText:"loading..."},c.prototype.setState=function(b){var c="disabled",d=this.$element,e=d.is("input")?"val":"html",f=d.data();b+="Text",null==f.resetText&&d.data("resetText",d[e]()),setTimeout(a.proxy(function(){d[e](null==f[b]?this.options[b]:f[b]),"loadingText"==b?(this.isLoading=!0,d.addClass(c).attr(c,c)):this.isLoading&&(this.isLoading=!1,d.removeClass(c).removeAttr(c))},this),0)},c.prototype.toggle=function(){var a=!0,b=this.$element.closest('[data-toggle="buttons"]');if(b.length){var c=this.$element.find("input");"radio"==c.prop("type")&&(c.prop("checked")&&this.$element.hasClass("active")?a=!1:b.find(".active").removeClass("active")),a&&c.prop("checked",!this.$element.hasClass("active")).trigger("change")}else this.$element.attr("aria-pressed",!this.$element.hasClass("active"));a&&this.$element.toggleClass("active")};var d=a.fn.button;a.fn.button=b,a.fn.button.Constructor=c,a.fn.button.noConflict=function(){return a.fn.button=d,this},a(document).on("click.bs.button.data-api",'[data-toggle^="button"]',function(c){var d=a(c.target);d.hasClass("btn")||(d=d.closest(".btn")),b.call(d,"toggle"),c.preventDefault()}).on("focus.bs.button.data-api blur.bs.button.data-api",'[data-toggle^="button"]',function(b){a(b.target).closest(".btn").toggleClass("focus","focus"==b.type)})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.carousel"),f=a.extend({},c.DEFAULTS,d.data(),"object"==typeof b&&b),g="string"==typeof b?b:f.slide;e||d.data("bs.carousel",e=new c(this,f)),"number"==typeof b?e.to(b):g?e[g]():f.interval&&e.pause().cycle()})}var c=function(b,c){this.$element=a(b),this.$indicators=this.$element.find(".carousel-indicators"),this.options=c,this.paused=this.sliding=this.interval=this.$active=this.$items=null,this.options.keyboard&&this.$element.on("keydown.bs.carousel",a.proxy(this.keydown,this)),"hover"==this.options.pause&&!("ontouchstart"in document.documentElement)&&this.$element.on("mouseenter.bs.carousel",a.proxy(this.pause,this)).on("mouseleave.bs.carousel",a.proxy(this.cycle,this))};c.VERSION="3.3.0",c.TRANSITION_DURATION=600,c.DEFAULTS={interval:5e3,pause:"hover",wrap:!0,keyboard:!0},c.prototype.keydown=function(a){switch(a.which){case 37:this.prev();break;case 39:this.next();break;default:return}a.preventDefault()},c.prototype.cycle=function(b){return b||(this.paused=!1),this.interval&&clearInterval(this.interval),this.options.interval&&!this.paused&&(this.interval=setInterval(a.proxy(this.next,this),this.options.interval)),this},c.prototype.getItemIndex=function(a){return this.$items=a.parent().children(".item"),this.$items.index(a||this.$active)},c.prototype.getItemForDirection=function(a,b){var c="prev"==a?-1:1,d=this.getItemIndex(b),e=(d+c)%this.$items.length;return this.$items.eq(e)},c.prototype.to=function(a){var b=this,c=this.getItemIndex(this.$active=this.$element.find(".item.active"));return a>this.$items.length-1||0>a?void 0:this.sliding?this.$element.one("slid.bs.carousel",function(){b.to(a)}):c==a?this.pause().cycle():this.slide(a>c?"next":"prev",this.$items.eq(a))},c.prototype.pause=function(b){return b||(this.paused=!0),this.$element.find(".next, .prev").length&&a.support.transition&&(this.$element.trigger(a.support.transition.end),this.cycle(!0)),this.interval=clearInterval(this.interval),this},c.prototype.next=function(){return this.sliding?void 0:this.slide("next")},c.prototype.prev=function(){return this.sliding?void 0:this.slide("prev")},c.prototype.slide=function(b,d){var e=this.$element.find(".item.active"),f=d||this.getItemForDirection(b,e),g=this.interval,h="next"==b?"left":"right",i="next"==b?"first":"last",j=this;if(!f.length){if(!this.options.wrap)return;f=this.$element.find(".item")[i]()}if(f.hasClass("active"))return this.sliding=!1;var k=f[0],l=a.Event("slide.bs.carousel",{relatedTarget:k,direction:h});if(this.$element.trigger(l),!l.isDefaultPrevented()){if(this.sliding=!0,g&&this.pause(),this.$indicators.length){this.$indicators.find(".active").removeClass("active");var m=a(this.$indicators.children()[this.getItemIndex(f)]);m&&m.addClass("active")}var n=a.Event("slid.bs.carousel",{relatedTarget:k,direction:h});return a.support.transition&&this.$element.hasClass("slide")?(f.addClass(b),f[0].offsetWidth,e.addClass(h),f.addClass(h),e.one("bsTransitionEnd",function(){f.removeClass([b,h].join(" ")).addClass("active"),e.removeClass(["active",h].join(" ")),j.sliding=!1,setTimeout(function(){j.$element.trigger(n)},0)}).emulateTransitionEnd(c.TRANSITION_DURATION)):(e.removeClass("active"),f.addClass("active"),this.sliding=!1,this.$element.trigger(n)),g&&this.cycle(),this}};var d=a.fn.carousel;a.fn.carousel=b,a.fn.carousel.Constructor=c,a.fn.carousel.noConflict=function(){return a.fn.carousel=d,this};var e=function(c){var d,e=a(this),f=a(e.attr("data-target")||(d=e.attr("href"))&&d.replace(/.*(?=#[^\s]+$)/,""));if(f.hasClass("carousel")){var g=a.extend({},f.data(),e.data()),h=e.attr("data-slide-to");h&&(g.interval=!1),b.call(f,g),h&&f.data("bs.carousel").to(h),c.preventDefault()}};a(document).on("click.bs.carousel.data-api","[data-slide]",e).on("click.bs.carousel.data-api","[data-slide-to]",e),a(window).on("load",function(){a('[data-ride="carousel"]').each(function(){var c=a(this);b.call(c,c.data())})})}(jQuery),+function(a){"use strict";function b(b){var c,d=b.attr("data-target")||(c=b.attr("href"))&&c.replace(/.*(?=#[^\s]+$)/,"");return a(d)}function c(b){return this.each(function(){var c=a(this),e=c.data("bs.collapse"),f=a.extend({},d.DEFAULTS,c.data(),"object"==typeof b&&b);!e&&f.toggle&&"show"==b&&(f.toggle=!1),e||c.data("bs.collapse",e=new d(this,f)),"string"==typeof b&&e[b]()})}var d=function(b,c){this.$element=a(b),this.options=a.extend({},d.DEFAULTS,c),this.$trigger=a(this.options.trigger).filter('[href="#'+b.id+'"], [data-target="#'+b.id+'"]'),this.transitioning=null,this.options.parent?this.$parent=this.getParent():this.addAriaAndCollapsedClass(this.$element,this.$trigger),this.options.toggle&&this.toggle()};d.VERSION="3.3.0",d.TRANSITION_DURATION=350,d.DEFAULTS={toggle:!0,trigger:'[data-toggle="collapse"]'},d.prototype.dimension=function(){var a=this.$element.hasClass("width");return a?"width":"height"},d.prototype.show=function(){if(!this.transitioning&&!this.$element.hasClass("in")){var b,e=this.$parent&&this.$parent.find("> .panel").children(".in, .collapsing");if(!(e&&e.length&&(b=e.data("bs.collapse"),b&&b.transitioning))){var f=a.Event("show.bs.collapse");if(this.$element.trigger(f),!f.isDefaultPrevented()){e&&e.length&&(c.call(e,"hide"),b||e.data("bs.collapse",null));var g=this.dimension();this.$element.removeClass("collapse").addClass("collapsing")[g](0).attr("aria-expanded",!0),this.$trigger.removeClass("collapsed").attr("aria-expanded",!0),this.transitioning=1;var h=function(){this.$element.removeClass("collapsing").addClass("collapse in")[g](""),this.transitioning=0,this.$element.trigger("shown.bs.collapse")};if(!a.support.transition)return h.call(this);var i=a.camelCase(["scroll",g].join("-"));this.$element.one("bsTransitionEnd",a.proxy(h,this)).emulateTransitionEnd(d.TRANSITION_DURATION)[g](this.$element[0][i])}}}},d.prototype.hide=function(){if(!this.transitioning&&this.$element.hasClass("in")){var b=a.Event("hide.bs.collapse");if(this.$element.trigger(b),!b.isDefaultPrevented()){var c=this.dimension();this.$element[c](this.$element[c]())[0].offsetHeight,this.$element.addClass("collapsing").removeClass("collapse in").attr("aria-expanded",!1),this.$trigger.addClass("collapsed").attr("aria-expanded",!1),this.transitioning=1;var e=function(){this.transitioning=0,this.$element.removeClass("collapsing").addClass("collapse").trigger("hidden.bs.collapse")};return a.support.transition?void this.$element[c](0).one("bsTransitionEnd",a.proxy(e,this)).emulateTransitionEnd(d.TRANSITION_DURATION):e.call(this)}}},d.prototype.toggle=function(){this[this.$element.hasClass("in")?"hide":"show"]()},d.prototype.getParent=function(){return a(this.options.parent).find('[data-toggle="collapse"][data-parent="'+this.options.parent+'"]').each(a.proxy(function(c,d){var e=a(d);this.addAriaAndCollapsedClass(b(e),e)},this)).end()},d.prototype.addAriaAndCollapsedClass=function(a,b){var c=a.hasClass("in");a.attr("aria-expanded",c),b.toggleClass("collapsed",!c).attr("aria-expanded",c)};var e=a.fn.collapse;a.fn.collapse=c,a.fn.collapse.Constructor=d,a.fn.collapse.noConflict=function(){return a.fn.collapse=e,this},a(document).on("click.bs.collapse.data-api",'[data-toggle="collapse"]',function(d){var e=a(this);e.attr("data-target")||d.preventDefault();var f=b(e),g=f.data("bs.collapse"),h=g?"toggle":a.extend({},e.data(),{trigger:this});c.call(f,h)})}(jQuery),+function(a){"use strict";function b(b){b&&3===b.which||(a(e).remove(),a(f).each(function(){var d=a(this),e=c(d),f={relatedTarget:this};e.hasClass("open")&&(e.trigger(b=a.Event("hide.bs.dropdown",f)),b.isDefaultPrevented()||(d.attr("aria-expanded","false"),e.removeClass("open").trigger("hidden.bs.dropdown",f)))}))}function c(b){var c=b.attr("data-target");c||(c=b.attr("href"),c=c&&/#[A-Za-z]/.test(c)&&c.replace(/.*(?=#[^\s]*$)/,""));var d=c&&a(c);return d&&d.length?d:b.parent()}function d(b){return this.each(function(){var c=a(this),d=c.data("bs.dropdown");d||c.data("bs.dropdown",d=new g(this)),"string"==typeof b&&d[b].call(c)})}var e=".dropdown-backdrop",f='[data-toggle="dropdown"]',g=function(b){a(b).on("click.bs.dropdown",this.toggle)};g.VERSION="3.3.0",g.prototype.toggle=function(d){var e=a(this);if(!e.is(".disabled, :disabled")){var f=c(e),g=f.hasClass("open");if(b(),!g){"ontouchstart"in document.documentElement&&!f.closest(".navbar-nav").length&&a('<div class="dropdown-backdrop"/>').insertAfter(a(this)).on("click",b);var h={relatedTarget:this};if(f.trigger(d=a.Event("show.bs.dropdown",h)),d.isDefaultPrevented())return;e.trigger("focus").attr("aria-expanded","true"),f.toggleClass("open").trigger("shown.bs.dropdown",h)}return!1}},g.prototype.keydown=function(b){if(/(38|40|27|32)/.test(b.which)){var d=a(this);if(b.preventDefault(),b.stopPropagation(),!d.is(".disabled, :disabled")){var e=c(d),g=e.hasClass("open");if(!g&&27!=b.which||g&&27==b.which)return 27==b.which&&e.find(f).trigger("focus"),d.trigger("click");var h=" li:not(.divider):visible a",i=e.find('[role="menu"]'+h+', [role="listbox"]'+h);if(i.length){var j=i.index(b.target);38==b.which&&j>0&&j--,40==b.which&&j<i.length-1&&j++,~j||(j=0),i.eq(j).trigger("focus")}}}};var h=a.fn.dropdown;a.fn.dropdown=d,a.fn.dropdown.Constructor=g,a.fn.dropdown.noConflict=function(){return a.fn.dropdown=h,this},a(document).on("click.bs.dropdown.data-api",b).on("click.bs.dropdown.data-api",".dropdown form",function(a){a.stopPropagation()}).on("click.bs.dropdown.data-api",f,g.prototype.toggle).on("keydown.bs.dropdown.data-api",f,g.prototype.keydown).on("keydown.bs.dropdown.data-api",'[role="menu"]',g.prototype.keydown).on("keydown.bs.dropdown.data-api",'[role="listbox"]',g.prototype.keydown)}(jQuery),+function(a){"use strict";function b(b,d){return this.each(function(){var e=a(this),f=e.data("bs.modal"),g=a.extend({},c.DEFAULTS,e.data(),"object"==typeof b&&b);f||e.data("bs.modal",f=new c(this,g)),"string"==typeof b?f[b](d):g.show&&f.show(d)})}var c=function(b,c){this.options=c,this.$body=a(document.body),this.$element=a(b),this.$backdrop=this.isShown=null,this.scrollbarWidth=0,this.options.remote&&this.$element.find(".modal-content").load(this.options.remote,a.proxy(function(){this.$element.trigger("loaded.bs.modal")},this))};c.VERSION="3.3.0",c.TRANSITION_DURATION=300,c.BACKDROP_TRANSITION_DURATION=150,c.DEFAULTS={backdrop:!0,keyboard:!0,show:!0},c.prototype.toggle=function(a){return this.isShown?this.hide():this.show(a)},c.prototype.show=function(b){var d=this,e=a.Event("show.bs.modal",{relatedTarget:b});this.$element.trigger(e),this.isShown||e.isDefaultPrevented()||(this.isShown=!0,this.checkScrollbar(),this.$body.addClass("modal-open"),this.setScrollbar(),this.escape(),this.$element.on("click.dismiss.bs.modal",'[data-dismiss="modal"]',a.proxy(this.hide,this)),this.backdrop(function(){var e=a.support.transition&&d.$element.hasClass("fade");d.$element.parent().length||d.$element.appendTo(d.$body),d.$element.show().scrollTop(0),e&&d.$element[0].offsetWidth,d.$element.addClass("in").attr("aria-hidden",!1),d.enforceFocus();var f=a.Event("shown.bs.modal",{relatedTarget:b});e?d.$element.find(".modal-dialog").one("bsTransitionEnd",function(){d.$element.trigger("focus").trigger(f)}).emulateTransitionEnd(c.TRANSITION_DURATION):d.$element.trigger("focus").trigger(f)}))},c.prototype.hide=function(b){b&&b.preventDefault(),b=a.Event("hide.bs.modal"),this.$element.trigger(b),this.isShown&&!b.isDefaultPrevented()&&(this.isShown=!1,this.escape(),a(document).off("focusin.bs.modal"),this.$element.removeClass("in").attr("aria-hidden",!0).off("click.dismiss.bs.modal"),a.support.transition&&this.$element.hasClass("fade")?this.$element.one("bsTransitionEnd",a.proxy(this.hideModal,this)).emulateTransitionEnd(c.TRANSITION_DURATION):this.hideModal())},c.prototype.enforceFocus=function(){a(document).off("focusin.bs.modal").on("focusin.bs.modal",a.proxy(function(a){this.$element[0]===a.target||this.$element.has(a.target).length||this.$element.trigger("focus")},this))},c.prototype.escape=function(){this.isShown&&this.options.keyboard?this.$element.on("keydown.dismiss.bs.modal",a.proxy(function(a){27==a.which&&this.hide()},this)):this.isShown||this.$element.off("keydown.dismiss.bs.modal")},c.prototype.hideModal=function(){var a=this;this.$element.hide(),this.backdrop(function(){a.$body.removeClass("modal-open"),a.resetScrollbar(),a.$element.trigger("hidden.bs.modal")})},c.prototype.removeBackdrop=function(){this.$backdrop&&this.$backdrop.remove(),this.$backdrop=null},c.prototype.backdrop=function(b){var d=this,e=this.$element.hasClass("fade")?"fade":"";if(this.isShown&&this.options.backdrop){var f=a.support.transition&&e;if(this.$backdrop=a('<div class="modal-backdrop '+e+'" />').prependTo(this.$element).on("click.dismiss.bs.modal",a.proxy(function(a){a.target===a.currentTarget&&("static"==this.options.backdrop?this.$element[0].focus.call(this.$element[0]):this.hide.call(this))},this)),f&&this.$backdrop[0].offsetWidth,this.$backdrop.addClass("in"),!b)return;f?this.$backdrop.one("bsTransitionEnd",b).emulateTransitionEnd(c.BACKDROP_TRANSITION_DURATION):b()}else if(!this.isShown&&this.$backdrop){this.$backdrop.removeClass("in");var g=function(){d.removeBackdrop(),b&&b()};a.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one("bsTransitionEnd",g).emulateTransitionEnd(c.BACKDROP_TRANSITION_DURATION):g()}else b&&b()},c.prototype.checkScrollbar=function(){this.scrollbarWidth=this.measureScrollbar()},c.prototype.setScrollbar=function(){var a=parseInt(this.$body.css("padding-right")||0,10);this.scrollbarWidth&&this.$body.css("padding-right",a+this.scrollbarWidth)},c.prototype.resetScrollbar=function(){this.$body.css("padding-right","")},c.prototype.measureScrollbar=function(){if(document.body.clientWidth>=window.innerWidth)return 0;var a=document.createElement("div");a.className="modal-scrollbar-measure",this.$body.append(a);var b=a.offsetWidth-a.clientWidth;return this.$body[0].removeChild(a),b};var d=a.fn.modal;a.fn.modal=b,a.fn.modal.Constructor=c,a.fn.modal.noConflict=function(){return a.fn.modal=d,this},a(document).on("click.bs.modal.data-api",'[data-toggle="modal"]',function(c){var d=a(this),e=d.attr("href"),f=a(d.attr("data-target")||e&&e.replace(/.*(?=#[^\s]+$)/,"")),g=f.data("bs.modal")?"toggle":a.extend({remote:!/#/.test(e)&&e},f.data(),d.data());d.is("a")&&c.preventDefault(),f.one("show.bs.modal",function(a){a.isDefaultPrevented()||f.one("hidden.bs.modal",function(){d.is(":visible")&&d.trigger("focus")})}),b.call(f,g,this)})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.tooltip"),f="object"==typeof b&&b,g=f&&f.selector;(e||"destroy"!=b)&&(g?(e||d.data("bs.tooltip",e={}),e[g]||(e[g]=new c(this,f))):e||d.data("bs.tooltip",e=new c(this,f)),"string"==typeof b&&e[b]())})}var c=function(a,b){this.type=this.options=this.enabled=this.timeout=this.hoverState=this.$element=null,this.init("tooltip",a,b)};c.VERSION="3.3.0",c.TRANSITION_DURATION=150,c.DEFAULTS={animation:!0,placement:"top",selector:!1,template:'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:!1,container:!1,viewport:{selector:"body",padding:0}},c.prototype.init=function(b,c,d){this.enabled=!0,this.type=b,this.$element=a(c),this.options=this.getOptions(d),this.$viewport=this.options.viewport&&a(this.options.viewport.selector||this.options.viewport);for(var e=this.options.trigger.split(" "),f=e.length;f--;){var g=e[f];if("click"==g)this.$element.on("click."+this.type,this.options.selector,a.proxy(this.toggle,this));else if("manual"!=g){var h="hover"==g?"mouseenter":"focusin",i="hover"==g?"mouseleave":"focusout";this.$element.on(h+"."+this.type,this.options.selector,a.proxy(this.enter,this)),this.$element.on(i+"."+this.type,this.options.selector,a.proxy(this.leave,this))}}this.options.selector?this._options=a.extend({},this.options,{trigger:"manual",selector:""}):this.fixTitle()},c.prototype.getDefaults=function(){return c.DEFAULTS},c.prototype.getOptions=function(b){return b=a.extend({},this.getDefaults(),this.$element.data(),b),b.delay&&"number"==typeof b.delay&&(b.delay={show:b.delay,hide:b.delay}),b},c.prototype.getDelegateOptions=function(){var b={},c=this.getDefaults();return this._options&&a.each(this._options,function(a,d){c[a]!=d&&(b[a]=d)}),b},c.prototype.enter=function(b){var c=b instanceof this.constructor?b:a(b.currentTarget).data("bs."+this.type);return c&&c.$tip&&c.$tip.is(":visible")?void(c.hoverState="in"):(c||(c=new this.constructor(b.currentTarget,this.getDelegateOptions()),a(b.currentTarget).data("bs."+this.type,c)),clearTimeout(c.timeout),c.hoverState="in",c.options.delay&&c.options.delay.show?void(c.timeout=setTimeout(function(){"in"==c.hoverState&&c.show()},c.options.delay.show)):c.show())},c.prototype.leave=function(b){var c=b instanceof this.constructor?b:a(b.currentTarget).data("bs."+this.type);return c||(c=new this.constructor(b.currentTarget,this.getDelegateOptions()),a(b.currentTarget).data("bs."+this.type,c)),clearTimeout(c.timeout),c.hoverState="out",c.options.delay&&c.options.delay.hide?void(c.timeout=setTimeout(function(){"out"==c.hoverState&&c.hide()},c.options.delay.hide)):c.hide()},c.prototype.show=function(){var b=a.Event("show.bs."+this.type);if(this.hasContent()&&this.enabled){this.$element.trigger(b);var d=a.contains(this.$element[0].ownerDocument.documentElement,this.$element[0]);if(b.isDefaultPrevented()||!d)return;var e=this,f=this.tip(),g=this.getUID(this.type);this.setContent(),f.attr("id",g),this.$element.attr("aria-describedby",g),this.options.animation&&f.addClass("fade");var h="function"==typeof this.options.placement?this.options.placement.call(this,f[0],this.$element[0]):this.options.placement,i=/\s?auto?\s?/i,j=i.test(h);j&&(h=h.replace(i,"")||"top"),f.detach().css({top:0,left:0,display:"block"}).addClass(h).data("bs."+this.type,this),this.options.container?f.appendTo(this.options.container):f.insertAfter(this.$element);var k=this.getPosition(),l=f[0].offsetWidth,m=f[0].offsetHeight;if(j){var n=h,o=this.options.container?a(this.options.container):this.$element.parent(),p=this.getPosition(o);h="bottom"==h&&k.bottom+m>p.bottom?"top":"top"==h&&k.top-m<p.top?"bottom":"right"==h&&k.right+l>p.width?"left":"left"==h&&k.left-l<p.left?"right":h,f.removeClass(n).addClass(h)}var q=this.getCalculatedOffset(h,k,l,m);this.applyPlacement(q,h);var r=function(){var a=e.hoverState;e.$element.trigger("shown.bs."+e.type),e.hoverState=null,"out"==a&&e.leave(e)};a.support.transition&&this.$tip.hasClass("fade")?f.one("bsTransitionEnd",r).emulateTransitionEnd(c.TRANSITION_DURATION):r()}},c.prototype.applyPlacement=function(b,c){var d=this.tip(),e=d[0].offsetWidth,f=d[0].offsetHeight,g=parseInt(d.css("margin-top"),10),h=parseInt(d.css("margin-left"),10);isNaN(g)&&(g=0),isNaN(h)&&(h=0),b.top=b.top+g,b.left=b.left+h,a.offset.setOffset(d[0],a.extend({using:function(a){d.css({top:Math.round(a.top),left:Math.round(a.left)})}},b),0),d.addClass("in");var i=d[0].offsetWidth,j=d[0].offsetHeight;"top"==c&&j!=f&&(b.top=b.top+f-j);var k=this.getViewportAdjustedDelta(c,b,i,j);k.left?b.left+=k.left:b.top+=k.top;var l=/top|bottom/.test(c),m=l?2*k.left-e+i:2*k.top-f+j,n=l?"offsetWidth":"offsetHeight";d.offset(b),this.replaceArrow(m,d[0][n],l)},c.prototype.replaceArrow=function(a,b,c){this.arrow().css(c?"left":"top",50*(1-a/b)+"%").css(c?"top":"left","")},c.prototype.setContent=function(){var a=this.tip(),b=this.getTitle();a.find(".tooltip-inner")[this.options.html?"html":"text"](b),a.removeClass("fade in top bottom left right")},c.prototype.hide=function(b){function d(){"in"!=e.hoverState&&f.detach(),e.$element.removeAttr("aria-describedby").trigger("hidden.bs."+e.type),b&&b()}var e=this,f=this.tip(),g=a.Event("hide.bs."+this.type);return this.$element.trigger(g),g.isDefaultPrevented()?void 0:(f.removeClass("in"),a.support.transition&&this.$tip.hasClass("fade")?f.one("bsTransitionEnd",d).emulateTransitionEnd(c.TRANSITION_DURATION):d(),this.hoverState=null,this)},c.prototype.fixTitle=function(){var a=this.$element;(a.attr("title")||"string"!=typeof a.attr("data-original-title"))&&a.attr("data-original-title",a.attr("title")||"").attr("title","")},c.prototype.hasContent=function(){return this.getTitle()},c.prototype.getPosition=function(b){b=b||this.$element;var c=b[0],d="BODY"==c.tagName,e=c.getBoundingClientRect();null==e.width&&(e=a.extend({},e,{width:e.right-e.left,height:e.bottom-e.top}));var f=d?{top:0,left:0}:b.offset(),g={scroll:d?document.documentElement.scrollTop||document.body.scrollTop:b.scrollTop()},h=d?{width:a(window).width(),height:a(window).height()}:null;return a.extend({},e,g,h,f)},c.prototype.getCalculatedOffset=function(a,b,c,d){return"bottom"==a?{top:b.top+b.height,left:b.left+b.width/2-c/2}:"top"==a?{top:b.top-d,left:b.left+b.width/2-c/2}:"left"==a?{top:b.top+b.height/2-d/2,left:b.left-c}:{top:b.top+b.height/2-d/2,left:b.left+b.width}},c.prototype.getViewportAdjustedDelta=function(a,b,c,d){var e={top:0,left:0};if(!this.$viewport)return e;var f=this.options.viewport&&this.options.viewport.padding||0,g=this.getPosition(this.$viewport);if(/right|left/.test(a)){var h=b.top-f-g.scroll,i=b.top+f-g.scroll+d;h<g.top?e.top=g.top-h:i>g.top+g.height&&(e.top=g.top+g.height-i)}else{var j=b.left-f,k=b.left+f+c;j<g.left?e.left=g.left-j:k>g.width&&(e.left=g.left+g.width-k)}return e},c.prototype.getTitle=function(){var a,b=this.$element,c=this.options;return a=b.attr("data-original-title")||("function"==typeof c.title?c.title.call(b[0]):c.title)},c.prototype.getUID=function(a){do a+=~~(1e6*Math.random());while(document.getElementById(a));return a},c.prototype.tip=function(){return this.$tip=this.$tip||a(this.options.template)},c.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".tooltip-arrow")},c.prototype.enable=function(){this.enabled=!0},c.prototype.disable=function(){this.enabled=!1},c.prototype.toggleEnabled=function(){this.enabled=!this.enabled},c.prototype.toggle=function(b){var c=this;b&&(c=a(b.currentTarget).data("bs."+this.type),c||(c=new this.constructor(b.currentTarget,this.getDelegateOptions()),a(b.currentTarget).data("bs."+this.type,c))),c.tip().hasClass("in")?c.leave(c):c.enter(c)},c.prototype.destroy=function(){var a=this;clearTimeout(this.timeout),this.hide(function(){a.$element.off("."+a.type).removeData("bs."+a.type)})};var d=a.fn.tooltip;a.fn.tooltip=b,a.fn.tooltip.Constructor=c,a.fn.tooltip.noConflict=function(){return a.fn.tooltip=d,this}}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.popover"),f="object"==typeof b&&b,g=f&&f.selector;(e||"destroy"!=b)&&(g?(e||d.data("bs.popover",e={}),e[g]||(e[g]=new c(this,f))):e||d.data("bs.popover",e=new c(this,f)),"string"==typeof b&&e[b]())})}var c=function(a,b){this.init("popover",a,b)};if(!a.fn.tooltip)throw new Error("Popover requires tooltip.js");c.VERSION="3.3.0",c.DEFAULTS=a.extend({},a.fn.tooltip.Constructor.DEFAULTS,{placement:"right",trigger:"click",content:"",template:'<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'}),c.prototype=a.extend({},a.fn.tooltip.Constructor.prototype),c.prototype.constructor=c,c.prototype.getDefaults=function(){return c.DEFAULTS},c.prototype.setContent=function(){var a=this.tip(),b=this.getTitle(),c=this.getContent();a.find(".popover-title")[this.options.html?"html":"text"](b),a.find(".popover-content").children().detach().end()[this.options.html?"string"==typeof c?"html":"append":"text"](c),a.removeClass("fade top bottom left right in"),a.find(".popover-title").html()||a.find(".popover-title").hide()},c.prototype.hasContent=function(){return this.getTitle()||this.getContent()},c.prototype.getContent=function(){var a=this.$element,b=this.options;return a.attr("data-content")||("function"==typeof b.content?b.content.call(a[0]):b.content)},c.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".arrow")},c.prototype.tip=function(){return this.$tip||(this.$tip=a(this.options.template)),this.$tip};var d=a.fn.popover;a.fn.popover=b,a.fn.popover.Constructor=c,a.fn.popover.noConflict=function(){return a.fn.popover=d,this}}(jQuery),+function(a){"use strict";function b(c,d){var e=a.proxy(this.process,this);this.$body=a("body"),this.$scrollElement=a(a(c).is("body")?window:c),this.options=a.extend({},b.DEFAULTS,d),this.selector=(this.options.target||"")+" .nav li > a",this.offsets=[],this.targets=[],this.activeTarget=null,this.scrollHeight=0,this.$scrollElement.on("scroll.bs.scrollspy",e),this.refresh(),this.process()}function c(c){return this.each(function(){var d=a(this),e=d.data("bs.scrollspy"),f="object"==typeof c&&c;e||d.data("bs.scrollspy",e=new b(this,f)),"string"==typeof c&&e[c]()})}b.VERSION="3.3.0",b.DEFAULTS={offset:10},b.prototype.getScrollHeight=function(){return this.$scrollElement[0].scrollHeight||Math.max(this.$body[0].scrollHeight,document.documentElement.scrollHeight)},b.prototype.refresh=function(){var b="offset",c=0;a.isWindow(this.$scrollElement[0])||(b="position",c=this.$scrollElement.scrollTop()),this.offsets=[],this.targets=[],this.scrollHeight=this.getScrollHeight();var d=this;this.$body.find(this.selector).map(function(){var d=a(this),e=d.data("target")||d.attr("href"),f=/^#./.test(e)&&a(e);return f&&f.length&&f.is(":visible")&&[[f[b]().top+c,e]]||null}).sort(function(a,b){return a[0]-b[0]}).each(function(){d.offsets.push(this[0]),d.targets.push(this[1])})},b.prototype.process=function(){var a,b=this.$scrollElement.scrollTop()+this.options.offset,c=this.getScrollHeight(),d=this.options.offset+c-this.$scrollElement.height(),e=this.offsets,f=this.targets,g=this.activeTarget;if(this.scrollHeight!=c&&this.refresh(),b>=d)return g!=(a=f[f.length-1])&&this.activate(a);if(g&&b<e[0])return this.activeTarget=null,this.clear();for(a=e.length;a--;)g!=f[a]&&b>=e[a]&&(!e[a+1]||b<=e[a+1])&&this.activate(f[a])},b.prototype.activate=function(b){this.activeTarget=b,this.clear();var c=this.selector+'[data-target="'+b+'"],'+this.selector+'[href="'+b+'"]',d=a(c).parents("li").addClass("active");d.parent(".dropdown-menu").length&&(d=d.closest("li.dropdown").addClass("active")),d.trigger("activate.bs.scrollspy")},b.prototype.clear=function(){a(this.selector).parentsUntil(this.options.target,".active").removeClass("active")};var d=a.fn.scrollspy;a.fn.scrollspy=c,a.fn.scrollspy.Constructor=b,a.fn.scrollspy.noConflict=function(){return a.fn.scrollspy=d,this},a(window).on("load.bs.scrollspy.data-api",function(){a('[data-spy="scroll"]').each(function(){var b=a(this);c.call(b,b.data())})})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.tab");e||d.data("bs.tab",e=new c(this)),"string"==typeof b&&e[b]()})}var c=function(b){this.element=a(b)};c.VERSION="3.3.0",c.TRANSITION_DURATION=150,c.prototype.show=function(){var b=this.element,c=b.closest("ul:not(.dropdown-menu)"),d=b.data("target");if(d||(d=b.attr("href"),d=d&&d.replace(/.*(?=#[^\s]*$)/,"")),!b.parent("li").hasClass("active")){var e=c.find(".active:last a"),f=a.Event("hide.bs.tab",{relatedTarget:b[0]}),g=a.Event("show.bs.tab",{relatedTarget:e[0]});if(e.trigger(f),b.trigger(g),!g.isDefaultPrevented()&&!f.isDefaultPrevented()){var h=a(d);this.activate(b.closest("li"),c),this.activate(h,h.parent(),function(){e.trigger({type:"hidden.bs.tab",relatedTarget:b[0]}),b.trigger({type:"shown.bs.tab",relatedTarget:e[0]})})}}},c.prototype.activate=function(b,d,e){function f(){g.removeClass("active").find("> .dropdown-menu > .active").removeClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded",!1),b.addClass("active").find('[data-toggle="tab"]').attr("aria-expanded",!0),h?(b[0].offsetWidth,b.addClass("in")):b.removeClass("fade"),b.parent(".dropdown-menu")&&b.closest("li.dropdown").addClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded",!0),e&&e()}var g=d.find("> .active"),h=e&&a.support.transition&&(g.length&&g.hasClass("fade")||!!d.find("> .fade").length);g.length&&h?g.one("bsTransitionEnd",f).emulateTransitionEnd(c.TRANSITION_DURATION):f(),g.removeClass("in")};var d=a.fn.tab;a.fn.tab=b,a.fn.tab.Constructor=c,a.fn.tab.noConflict=function(){return a.fn.tab=d,this};var e=function(c){c.preventDefault(),b.call(a(this),"show")};a(document).on("click.bs.tab.data-api",'[data-toggle="tab"]',e).on("click.bs.tab.data-api",'[data-toggle="pill"]',e)
}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.affix"),f="object"==typeof b&&b;e||d.data("bs.affix",e=new c(this,f)),"string"==typeof b&&e[b]()})}var c=function(b,d){this.options=a.extend({},c.DEFAULTS,d),this.$target=a(this.options.target).on("scroll.bs.affix.data-api",a.proxy(this.checkPosition,this)).on("click.bs.affix.data-api",a.proxy(this.checkPositionWithEventLoop,this)),this.$element=a(b),this.affixed=this.unpin=this.pinnedOffset=null,this.checkPosition()};c.VERSION="3.3.0",c.RESET="affix affix-top affix-bottom",c.DEFAULTS={offset:0,target:window},c.prototype.getState=function(a,b,c,d){var e=this.$target.scrollTop(),f=this.$element.offset(),g=this.$target.height();if(null!=c&&"top"==this.affixed)return c>e?"top":!1;if("bottom"==this.affixed)return null!=c?e+this.unpin<=f.top?!1:"bottom":a-d>=e+g?!1:"bottom";var h=null==this.affixed,i=h?e:f.top,j=h?g:b;return null!=c&&c>=i?"top":null!=d&&i+j>=a-d?"bottom":!1},c.prototype.getPinnedOffset=function(){if(this.pinnedOffset)return this.pinnedOffset;this.$element.removeClass(c.RESET).addClass("affix");var a=this.$target.scrollTop(),b=this.$element.offset();return this.pinnedOffset=b.top-a},c.prototype.checkPositionWithEventLoop=function(){setTimeout(a.proxy(this.checkPosition,this),1)},c.prototype.checkPosition=function(){if(this.$element.is(":visible")){var b=this.$element.height(),d=this.options.offset,e=d.top,f=d.bottom,g=a("body").height();"object"!=typeof d&&(f=e=d),"function"==typeof e&&(e=d.top(this.$element)),"function"==typeof f&&(f=d.bottom(this.$element));var h=this.getState(g,b,e,f);if(this.affixed!=h){null!=this.unpin&&this.$element.css("top","");var i="affix"+(h?"-"+h:""),j=a.Event(i+".bs.affix");if(this.$element.trigger(j),j.isDefaultPrevented())return;this.affixed=h,this.unpin="bottom"==h?this.getPinnedOffset():null,this.$element.removeClass(c.RESET).addClass(i).trigger(i.replace("affix","affixed")+".bs.affix")}"bottom"==h&&this.$element.offset({top:g-b-f})}};var d=a.fn.affix;a.fn.affix=b,a.fn.affix.Constructor=c,a.fn.affix.noConflict=function(){return a.fn.affix=d,this},a(window).on("load",function(){a('[data-spy="affix"]').each(function(){var c=a(this),d=c.data();d.offset=d.offset||{},null!=d.offsetBottom&&(d.offset.bottom=d.offsetBottom),null!=d.offsetTop&&(d.offset.top=d.offsetTop),b.call(c,d)})})}(jQuery);;
/*
 * jQuery.appear
 * https://github.com/bas2k/jquery.appear/
 * http://code.google.com/p/jquery-appear/
 * http://bas2k.ru/
 *
 * Copyright (c) 2009 Michael Hixson
 * Copyright (c) 2012-2014 Alexander Brovikov
 * Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php)
 */
(function($) {
    $.fn.appear = function(fn, options) {

        var settings = $.extend({

            //arbitrary data to pass to fn
            data: undefined,

            //call fn only on the first appear?
            one: true,

            // X & Y accuracy
            accX: 0,
            accY: 0

        }, options);

        return this.each(function() {

            var t = $(this);

            //whether the element is currently visible
            t.appeared = false;

            if (!fn) {

                //trigger the custom event
                t.trigger('appear', settings.data);
                return;
            }

            var w = $(window);

            //fires the appear event when appropriate
            var check = function() {

                //is the element hidden?
                if (!t.is(':visible')) {

                    //it became hidden
                    t.appeared = false;
                    return;
                }

                //is the element inside the visible window?
                var a = w.scrollLeft();
                var b = w.scrollTop();
                var o = t.offset();
                var x = o.left;
                var y = o.top;

                var ax = settings.accX;
                var ay = settings.accY;
                var th = t.height();
                var wh = w.height();
                var tw = t.width();
                var ww = w.width();

                if (y + th + ay >= b &&
                    y <= b + wh + ay &&
                    x + tw + ax >= a &&
                    x <= a + ww + ax) {

                    //trigger the custom event
                    if (!t.appeared) t.trigger('appear', settings.data);

                } else {

                    //it scrolled out of view
                    t.appeared = false;
                }
            };

            //create a modified fn with some additional logic
            var modifiedFn = function() {

                //mark the element as visible
                t.appeared = true;

                //is this supposed to happen only once?
                if (settings.one) {

                    //remove the check
                    w.unbind('scroll', check);
                    var i = $.inArray(check, $.fn.appear.checks);
                    if (i >= 0) $.fn.appear.checks.splice(i, 1);
                }

                //trigger the original fn
                fn.apply(this, arguments);
            };

            //bind the modified fn to the element
            if (settings.one) t.one('appear', settings.data, modifiedFn);
            else t.bind('appear', settings.data, modifiedFn);

            //check whenever the window scrolls
            w.scroll(check);

            //check whenever the dom changes
            $.fn.appear.checks.push(check);

            //check now
            (check)();
        });
    };

    //keep a queue of appearance checks
    $.extend($.fn.appear, {

        checks: [],
        timeout: null,

        //process the queue
        checkAll: function() {
            var length = $.fn.appear.checks.length;
            if (length > 0) while (length--) ($.fn.appear.checks[length])();
        },

        //check the queue asynchronously
        run: function() {
            if ($.fn.appear.timeout) clearTimeout($.fn.appear.timeout);
            $.fn.appear.timeout = setTimeout($.fn.appear.checkAll, 20);
        }
    });

    //run checks when these methods are called
    $.each(['append', 'prepend', 'after', 'before', 'attr',
        'removeAttr', 'addClass', 'removeClass', 'toggleClass',
        'remove', 'css', 'show', 'hide'], function(i, n) {
        var old = $.fn[n];
        if (old) {
            $.fn[n] = function() {
                var r = old.apply(this, arguments);
                $.fn.appear.run();
                return r;
            }
        }
    });

})(jQuery);;
/*!
 * Cube Portfolio - Responsive jQuery Grid Plugin
 *
 * version: 1.6.0 (7 November, 2014)
 * requires jQuery v1.7 or later
 *
 * Copyright (c) 2014, Mihai Buricea (http://scriptpie.com)
 * Released under CodeCanyon License http://codecanyon.net/licenses
 *
 */
!function(a,b,c,d){"use strict";var e="cbp",f="."+e;"function"!=typeof Object.create&&(Object.create=function(a){function b(){}return b.prototype=a,new b}),a.expr[":"].uncached=function(b){if(!a(b).is('img[src!=""]'))return!1;var c=new Image;return c.src=b.src,!c.complete};var g={init:function(a,b){var c,d=this;return d.cubeportfolio=a,d.type=b,d.isOpen=!1,d.options=d.cubeportfolio.options,"singlePageInline"===b?(d.matrice=[-1,-1],d.height=0,void d._createMarkupSinglePageInline()):(d._createMarkup(),void(d.options.singlePageDeeplinking&&"singlePage"===b&&(d.url=location.href,"#"===d.url.slice(-1)&&(d.url=d.url.slice(0,-1)),c=d.cubeportfolio.blocksAvailable.find(d.options.singlePageDelegate).filter(function(){return d.url.split("#cbp=")[1]===this.getAttribute("href")})[0],c&&(d.url=d.url.replace(/#cbp=(.+)/gi,""),d.openSinglePage(d.cubeportfolio.blocksAvailable.find(d.options.singlePageDelegate),c)))))},_createMarkup:function(){var b=this,d="";"singlePage"===b.type&&"left"!==b.options.singlePageAnimation&&(d=" cbp-popup-singlePage-"+b.options.singlePageAnimation),b.wrap=a("<div/>",{"class":"cbp-popup-wrap cbp-popup-"+b.type+d,"data-action":"lightbox"===b.type?"close":""}).on("click"+f,function(c){if(!b.stopEvents){var d=a(c.target).attr("data-action");b[d]&&(b[d](),c.preventDefault())}}),b.content=a("<div/>",{"class":"cbp-popup-content"}).appendTo(b.wrap),a("<div/>",{"class":"cbp-popup-loadingBox"}).appendTo(b.wrap),"ie8"===b.cubeportfolio.browser&&(b.bg=a("<div/>",{"class":"cbp-popup-ie8bg","data-action":"lightbox"===b.type?"close":""}).appendTo(b.wrap)),b.navigationWrap=a("<div/>",{"class":"cbp-popup-navigation-wrap"}).appendTo(b.wrap),b.navigation=a("<div/>",{"class":"cbp-popup-navigation"}).appendTo(b.navigationWrap),b.closeButton=a("<div/>",{"class":"cbp-popup-close",title:"Close (Esc arrow key)","data-action":"close"}).appendTo(b.navigation),b.nextButton=a("<div/>",{"class":"cbp-popup-next",title:"Next (Right arrow key)","data-action":"next"}).appendTo(b.navigation),b.prevButton=a("<div/>",{"class":"cbp-popup-prev",title:"Previous (Left arrow key)","data-action":"prev"}).appendTo(b.navigation),"singlePage"===b.type&&(b.options.singlePageCounter&&(b.counter=a(b.options.singlePageCounter).appendTo(b.navigation),b.counter.text("")),b.content.on("click"+f,b.options.singlePageDelegate,function(a){a.preventDefault();var c,d=b.dataArray.length,e=this.getAttribute("href");for(c=0;d>c&&b.dataArray[c].url!==e;c++);b.singlePageJumpTo(c-b.current)}),b.wrap.on("mousewheel"+f+" DOMMouseScroll"+f,function(a){a.stopImmediatePropagation()})),a(c).on("keydown"+f,function(a){b.isOpen&&(b.stopEvents||(37===a.keyCode?b.prev():39===a.keyCode?b.next():27===a.keyCode&&b.close()))})},_createMarkupSinglePageInline:function(){var b=this;b.wrap=a("<div/>",{"class":"cbp-popup-singlePageInline"}).on("click"+f,function(c){if(!b.stopEvents){var d=a(c.target).attr("data-action");d&&b[d]&&(b[d](),c.preventDefault())}}),b.content=a("<div/>",{"class":"cbp-popup-content"}).appendTo(b.wrap),a("<div/>",{"class":"cbp-popup-loadingBox"}).appendTo(b.wrap),b.navigation=a("<div/>",{"class":"cbp-popup-navigation"}).appendTo(b.wrap),b.closeButton=a("<div/>",{"class":"cbp-popup-close",title:"Close (Esc arrow key)","data-action":"close"}).appendTo(b.navigation)},destroy:function(){var b=this,d=a("body");a(c).off("keydown"+f),d.off("click"+f,b.options.lightboxDelegate),d.off("click"+f,b.options.singlePageDelegate),b.content.off("click"+f,b.options.singlePageDelegate),b.cubeportfolio.$obj.off("click"+f,b.options.singlePageInlineDelegate),b.cubeportfolio.$obj.off("click"+f,b.options.lightboxDelegate),b.cubeportfolio.$obj.off("click"+f,b.options.singlePageDelegate),b.cubeportfolio.$obj.removeClass("cbp-popup-isOpening"),b.cubeportfolio.blocks.removeClass("cbp-singlePageInline-active cbp-singlePageInline-active-loading"),b.wrap.remove()},openLightbox:function(d,e){var f,g,h=this,i=0,j=[];if(!h.isOpen){if(h.isOpen=!0,h.stopEvents=!1,h.dataArray=[],h.current=null,f=e.getAttribute("href"),null===f)throw new Error("HEI! Your clicked element doesn't have a href attribute.");a.each(d,function(b,c){var d,e=c.getAttribute("href"),g=e,k="isImage";if(-1===a.inArray(e,j)){if(f===e)h.current=i;else if(!h.options.lightboxGallery)return;/youtube/i.test(e)?(d=e.substring(e.lastIndexOf("v=")+2),/autoplay=/i.test(d)||(d+="&autoplay=1"),d=d.replace(/\?|&/,"?"),g="//www.youtube.com/embed/"+d,k="isYoutube"):/vimeo/i.test(e)?(d=e.substring(e.lastIndexOf("/")+1),/autoplay=/i.test(d)||(d+="&autoplay=1"),d=d.replace(/\?|&/,"?"),g="//player.vimeo.com/video/"+d,k="isVimeo"):/ted\.com/i.test(e)?(g="http://embed.ted.com/talks/"+e.substring(e.lastIndexOf("/")+1)+".html",k="isTed"):/(\.mp4)|(\.ogg)|(\.ogv)|(\.webm)/i.test(e)&&(g=e.split(-1!==e.indexOf("|")?"|":"%7C"),k="isSelfHosted"),h.dataArray.push({src:g,title:c.getAttribute(h.options.lightboxTitleSrc),type:k}),i++}j.push(e)}),h.counterTotal=h.dataArray.length,1===h.counterTotal?(h.nextButton.hide(),h.prevButton.hide(),h.dataActionImg=""):(h.nextButton.show(),h.prevButton.show(),h.dataActionImg='data-action="next"'),h.wrap.appendTo(c.body),h.scrollTop=a(b).scrollTop(),h.originalStyle=a("html").attr("style"),a("html").css({overflow:"hidden",paddingRight:b.innerWidth-a(c).width()}),h.wrap.show(),g=h.dataArray[h.current],h[g.type](g)}},openSinglePage:function(d,e){var f,g=this,h=0,i=[];if(!g.isOpen){if(g.cubeportfolio.singlePageInline&&g.cubeportfolio.singlePageInline.isOpen&&g.cubeportfolio.singlePageInline.close(),g.isOpen=!0,g.stopEvents=!1,g.dataArray=[],g.current=null,f=e.getAttribute("href"),null===f)throw new Error("HEI! Your clicked element doesn't have a href attribute.");if(a.each(d,function(b,c){var d=c.getAttribute("href");-1===a.inArray(d,i)&&(f===d&&(g.current=h),g.dataArray.push({url:d,element:c}),h++),i.push(d)}),g.counterTotal=g.dataArray.length,1===g.counterTotal?(g.nextButton.hide(),g.prevButton.hide()):(g.nextButton.show(),g.prevButton.show()),g.wrap.appendTo(c.body),g.scrollTop=a(b).scrollTop(),a("html").css({overflow:"hidden",paddingRight:b.innerWidth-a(c).width()}),g.wrap.scrollTop(0),a.isFunction(g.options.singlePageCallback)&&g.options.singlePageCallback.call(g,g.dataArray[g.current].url,g.dataArray[g.current].element),g.wrap.show(),g.wrap.one(g.cubeportfolio.transitionEnd,function(){var a;g.options.singlePageStickyNavigation&&(g.wrap.addClass("cbp-popup-singlePage-sticky"),a=g.wrap[0].clientWidth,g.navigationWrap.width(a))}),("ie8"===g.cubeportfolio.browser||"ie9"===g.cubeportfolio.browser)&&(setTimeout(function(){g.wrap.addClass("cbp-popup-singlePage-sticky")},1e3),g.options.singlePageStickyNavigation)){var j=g.wrap[0].clientWidth;g.navigationWrap.width(j)}setTimeout(function(){g.wrap.addClass("cbp-popup-singlePage-open")},20),g.options.singlePageDeeplinking&&(location.href=g.url+"#cbp="+g.dataArray[g.current].url)}},openSinglePageInline:function(b,c,d){var e,f,g,h,i,j,k=this,l=0,m=0,n=0;if(d=d||!1,k.storeBlocks=b,k.storeCurrentBlock=c,k.isOpen)return h=a(c).closest(".cbp-item").index(".cbp-item"),void(k.dataArray[k.current].url!==c.getAttribute("href")||k.current!==h?k.cubeportfolio.singlePageInline.close("open",{blocks:b,currentBlock:c,fromOpen:!0}):k.close());if(k.wrap.addClass("cbp-popup-loading"),k.isOpen=!0,k.stopEvents=!1,k.dataArray=[],k.current=null,e=c.getAttribute("href"),null===e)throw new Error("HEI! Your clicked element doesn't have a href attribute.");i=a(c).closest(".cbp-item")[0],a.each(b,function(a,b){i===b&&(k.current=a)}),k.dataArray[k.current]={url:e,element:c},j=a(k.dataArray[k.current].element).parents(".cbp-item").addClass("cbp-singlePageInline-active"),d||j.addClass("cbp-singlePageInline-active-loading"),k.counterTotal=b.length,k.wrap.insertBefore(k.cubeportfolio.$ul),"top"===k.options.singlePageInlinePosition?(m=0,n=k.cubeportfolio.cols-1):"bottom"===k.options.singlePageInlinePosition?(m=k.counterTotal,n=k.counterTotal,k.lastColumn=!0,d?k.lastColumn&&(k.top=k.lastColumnHeight):(k.lastColumnHeight=k.cubeportfolio.height,k.top=k.lastColumnHeight)):"above"===k.options.singlePageInlinePosition?(l=Math.floor(k.current/k.cubeportfolio.cols),m=k.cubeportfolio.cols*l,n=k.cubeportfolio.cols*(l+1)-1):(l=Math.floor(k.current/k.cubeportfolio.cols),m=Math.min(k.cubeportfolio.cols*(l+1),k.counterTotal),n=Math.min(k.cubeportfolio.cols*(l+2)-1,k.counterTotal),f=Math.ceil((k.current+1)/k.cubeportfolio.cols),g=Math.ceil(k.counterTotal/k.cubeportfolio.cols),k.lastColumn=f===g,d?k.lastColumn&&(k.top=k.lastColumnHeight):(k.lastColumnHeight=k.cubeportfolio.height,k.top=k.lastColumnHeight)),k.matrice=[m,n],a.isFunction(k.options.singlePageInlineCallback)&&k.options.singlePageInlineCallback.call(k,k.dataArray[k.current].url,k.dataArray[k.current].element)},_resizeSinglePageInline:function(c){var d,e=this;c=c||!1,e.height=e.content.outerHeight(!0),e.cubeportfolio._layout(),e.cubeportfolio._processStyle(e.cubeportfolio.transition),c&&e.wrap.removeClass("cbp-popup-loading"),e.cubeportfolio.$obj.addClass("cbp-popup-isOpening"),e.wrap.css({height:e.height}),e.wrap.css({top:e.top}),d=e.lastColumn?e.height:0,e.cubeportfolio._resizeMainContainer(e.cubeportfolio.transition,d),e.options.singlePageInlineInFocus&&(e.scrollTop=a(b).scrollTop(),a("body,html").animate({scrollTop:e.wrap.offset().top-150})),a(".cbp-singlePageInline-active").removeClass("cbp-singlePageInline-active-loading")},appendScriptsToWrap:function(a){var b=this,d=0,e=function(f){var g=c.createElement("script"),h=f.src;g.type="text/javascript",g.readyState?g.onreadystatechange=function(){("loaded"==g.readyState||"complete"==g.readyState)&&(g.onreadystatechange=null,d++,a[d]&&e(a[d]))}:g.onload=function(){d++,a[d]&&e(a[d])},h?g.src=h:g.text=f.text,b.content[0].appendChild(g)};e(a[0])},updateSinglePage:function(b,c,d){var e,f,g=this;g.content.addClass("cbp-popup-content").removeClass("cbp-popup-content-basic"),d===!1&&g.content.removeClass("cbp-popup-content").addClass("cbp-popup-content-basic"),g.content.html(b),c&&(g.wrap.hasClass("cbp-popup-ready")?g.appendScriptsToWrap(c):g.wrap.one(g.cubeportfolio.transitionEnd,function(){g.appendScriptsToWrap(c)})),g.wrap.addClass("cbp-popup-ready"),g.wrap.removeClass("cbp-popup-loading"),g.counter&&(f=a(g._getCounterMarkup(g.options.singlePageCounter,g.current+1,g.counterTotal)),g.counter.text(f.text())),e=g.content.find(".cbp-slider"),e?(g.slider=Object.create(h),g.slider._init(g,e)):g.slider=null,g.wrap.one(g.cubeportfolio.transitionEnd,function(){("android"===g.cubeportfolio.browser||"ios"===g.cubeportfolio.browser)&&a("html").css({position:"fixed"})})},updateSinglePageInline:function(a,b){var c,d=this;d.content.html(a),d._loadSinglePageInline(),b&&d.appendScriptsToWrap(b),c=d.content.find(".cbp-slider"),c?(d.slider=Object.create(h),d.slider._init(d,c)):d.slider=null},_loadSinglePageInline:function(){var b,c,d,e=this,g=[],h=/url\((['"]?)(.*?)\1\)/g;if(d=e.wrap.children().css("backgroundImage"))for(var i;i=h.exec(d);)g.push({src:i[2]});e.wrap.find("*").each(function(){var b=a(this);if(b.is("img:uncached")&&g.push({src:b.attr("src"),element:b[0]}),d=b.css("backgroundImage"))for(var c;c=h.exec(d);)g.push({src:c[2],element:b[0]})});var j=g.length,k=0;0===j&&setTimeout(function(){e._resizeSinglePageInline(!0)},0);var l=function(){k++,k===j&&setTimeout(function(){e._resizeSinglePageInline(!0)},0)};for(b=0;j>b;b++)c=new Image,a(c).on("load"+f+" error"+f,l),c.src=g[b].src},isImage:function(b){var c=this,d=new Image;c.tooggleLoading(!0),a('<img src="'+b.src+'">').is("img:uncached")?(a(d).on("load"+f+" error"+f,function(){c.updateImagesMarkup(b.src,b.title,c._getCounterMarkup(c.options.lightboxCounter,c.current+1,c.counterTotal)),c.tooggleLoading(!1)}),d.src=b.src):(c.updateImagesMarkup(b.src,b.title,c._getCounterMarkup(c.options.lightboxCounter,c.current+1,c.counterTotal)),c.tooggleLoading(!1))},isVimeo:function(a){var b=this;b.updateVideoMarkup(a.src,a.title,b._getCounterMarkup(b.options.lightboxCounter,b.current+1,b.counterTotal))},isYoutube:function(a){var b=this;b.updateVideoMarkup(a.src,a.title,b._getCounterMarkup(b.options.lightboxCounter,b.current+1,b.counterTotal))},isTed:function(a){var b=this;b.updateVideoMarkup(a.src,a.title,b._getCounterMarkup(b.options.lightboxCounter,b.current+1,b.counterTotal))},isSelfHosted:function(a){var b=this;b.updateSelfHostedVideo(a.src,a.title,b._getCounterMarkup(b.options.lightboxCounter,b.current+1,b.counterTotal))},_getCounterMarkup:function(a,b,c){var d;return a.length?(d={current:b,total:c},a.replace(/\{\{current}}|\{\{total}}/gi,function(a){return d[a.slice(2,-2)]})):""},updateSelfHostedVideo:function(a,b,c){var d,e=this;e.wrap.addClass("cbp-popup-lightbox-isIframe");var f='<div class="cbp-popup-lightbox-iframe"><video controls="controls" height="auto" style="width: 100%">';for(d=0;d<a.length;d++)/(\.mp4)/i.test(a[d])?f+='<source src="'+a[d]+'" type="video/mp4">':/(\.ogg)|(\.ogv)/i.test(a[d])?f+='<source src="'+a[d]+'" type="video/ogg">':/(\.webm)/i.test(a[d])&&(f+='<source src="'+a[d]+'" type="video/webm">');f+='Your browser does not support the video tag.</video><div class="cbp-popup-lightbox-bottom">'+(b?'<div class="cbp-popup-lightbox-title">'+b+"</div>":"")+c+"</div></div>",e.content.html(f),e.wrap.addClass("cbp-popup-ready"),e.preloadNearbyImages()},updateVideoMarkup:function(a,b,c){var d=this;d.wrap.addClass("cbp-popup-lightbox-isIframe");var e='<div class="cbp-popup-lightbox-iframe"><iframe src="'+a+'" frameborder="0" allowfullscreen scrolling="no"></iframe><div class="cbp-popup-lightbox-bottom">'+(b?'<div class="cbp-popup-lightbox-title">'+b+"</div>":"")+c+"</div></div>";d.content.html(e),d.wrap.addClass("cbp-popup-ready"),d.preloadNearbyImages()},updateImagesMarkup:function(a,b,c){var d=this;d.wrap.removeClass("cbp-popup-lightbox-isIframe");var e='<div class="cbp-popup-lightbox-figure"><img src="'+a+'" class="cbp-popup-lightbox-img" '+d.dataActionImg+' /><div class="cbp-popup-lightbox-bottom">'+(b?'<div class="cbp-popup-lightbox-title">'+b+"</div>":"")+c+"</div></div>";d.content.html(e),d.wrap.addClass("cbp-popup-ready"),d.resizeImage(),d.preloadNearbyImages()},next:function(){var a=this;a[a.type+"JumpTo"](1)},prev:function(){var a=this;a[a.type+"JumpTo"](-1)},lightboxJumpTo:function(a){var b,c=this;c.current=c.getIndex(c.current+a),b=c.dataArray[c.current],c[b.type](b)},singlePageJumpTo:function(b){var c=this;c.current=c.getIndex(c.current+b),a.isFunction(c.options.singlePageCallback)&&(c.resetWrap(),c.wrap.scrollTop(0),c.wrap.addClass("cbp-popup-loading"),c.options.singlePageCallback.call(c,c.dataArray[c.current].url,c.dataArray[c.current].element),c.options.singlePageDeeplinking&&(location.href=c.url+"#cbp="+c.dataArray[c.current].url))},resetWrap:function(){var a=this;"singlePage"===a.type&&a.options.singlePageDeeplinking&&(location.href=a.url+"#")},getIndex:function(a){var b=this;return a%=b.counterTotal,0>a&&(a=b.counterTotal+a),a},close:function(c,d){var e=this;e.isOpen=!1,"singlePageInline"===e.type?"open"===c?(e.wrap.addClass("cbp-popup-loading"),a(e.dataArray[e.current].element).closest(".cbp-item").removeClass("cbp-singlePageInline-active cbp-singlePageInline-active-loading"),e.openSinglePageInline(d.blocks,d.currentBlock,d.fromOpen)):(e.matrice=[-1,-1],e.cubeportfolio._layout(),e.cubeportfolio._processStyle(e.cubeportfolio.transition),e.cubeportfolio._resizeMainContainer(e.cubeportfolio.transition),e.wrap.css({height:0}),a(e.dataArray[e.current].element).parents(".cbp-item").removeClass("cbp-singlePageInline-active cbp-singlePageInline-active-loading"),"ie8"===e.cubeportfolio.browser||"ie9"===e.cubeportfolio.browser?(e.content.html(""),e.wrap.detach(),e.cubeportfolio.$obj.removeClass("cbp-popup-isOpening"),"promise"===c&&a.isFunction(d.callback)&&d.callback.call(e.cubeportfolio)):e.wrap.one(e.cubeportfolio.transitionEnd,function(){e.content.html(""),e.wrap.detach(),e.cubeportfolio.$obj.removeClass("cbp-popup-isOpening"),"promise"===c&&a.isFunction(d.callback)&&d.callback.call(e.cubeportfolio)}),e.options.singlePageInlineInFocus&&a("body, html").animate({scrollTop:e.scrollTop})):"singlePage"===e.type?(e.resetWrap(),e.wrap.removeClass("cbp-popup-ready"),("android"===e.cubeportfolio.browser||"ios"===e.cubeportfolio.browser)&&a("html").css({position:""}),a(b).scrollTop(e.scrollTop),setTimeout(function(){e.stopScroll=!0,e.navigationWrap.css({top:e.wrap.scrollTop()}),e.wrap.removeClass("cbp-popup-singlePage-open cbp-popup-singlePage-sticky"),("ie8"===e.cubeportfolio.browser||"ie9"===e.cubeportfolio.browser)&&(e.content.html(""),e.wrap.detach(),a("html").css({overflow:"",paddingRight:""}),e.navigationWrap.removeAttr("style"))},0),e.wrap.one(e.cubeportfolio.transitionEnd,function(){e.content.html(""),e.wrap.detach(),a("html").css({overflow:"",paddingRight:""}),e.navigationWrap.removeAttr("style")})):(e.originalStyle?a("html").attr("style",e.originalStyle):a("html").css({overflow:"",paddingRight:""}),a(b).scrollTop(e.scrollTop),e.content.html(""),e.wrap.detach())},tooggleLoading:function(a){var b=this;b.stopEvents=a,b.wrap[a?"addClass":"removeClass"]("cbp-popup-loading")},resizeImage:function(){if(this.isOpen){var c=a(b).height(),d=this.content.find("img"),e=parseInt(d.css("margin-top"),10)+parseInt(d.css("margin-bottom"),10);d.css("max-height",c-e+"px")}},preloadNearbyImages:function(){var b,c,d=[],e=this;d.push(e.getIndex(e.current+1)),d.push(e.getIndex(e.current+2)),d.push(e.getIndex(e.current+3)),d.push(e.getIndex(e.current-1)),d.push(e.getIndex(e.current-2)),d.push(e.getIndex(e.current-3));for(var f=d.length-1;f>=0;f--)"isImage"===e.dataArray[d[f]].type&&(c=e.dataArray[d[f]].src,b=new Image,a('<img src="'+c+'">').is("img:uncached")&&(b.src=c))}},h={_init:function(b,c){var d=this;d.current=0,d.obj=c,d.$obj=a(c),d._createMarkup(),d._events()},_createMarkup:function(){var b,c,d=this;d.$ul=d.$obj.children(".cbp-slider-wrap"),d.$li=d.$ul.children(".cbp-slider-item"),d.$li.eq(0).addClass("cbp-slider-item-current"),d.$liLength=d.$li.length,b=a("<div/>",{"class":"cbp-slider-arrowWrap"}).appendTo(d.$obj),a("<div/>",{"class":"cbp-slider-arrowNext","data-action":"nextItem"}).appendTo(b),a("<div/>",{"class":"cbp-slider-arrowPrev","data-action":"prevItem"}).appendTo(b),c=a("<div/>",{"class":"cbp-slider-bulletWrap"}).appendTo(d.$obj);for(var e=0;e<d.$liLength;e++){var f=0===e?" cbp-slider-bullet-current":"";a("<div/>",{"class":"cbp-slider-bullet"+f,"data-action":"jumpToItem"}).appendTo(c)}},_events:function(){var b=this;b.$obj.on("click"+f,function(c){var d=a(c.target).attr("data-action");b[d]&&(b[d](c),c.preventDefault())})},nextItem:function(){this.jumpTo(1)},prevItem:function(){this.jumpTo(-1)},jumpToItem:function(b){var c=a(b.target),d=c.index();this.jumpTo(d-this.current)},jumpTo:function(b){var c,d=this,e=this.$li.eq(this.current);this.current=this.getIndex(this.current+b),c=this.$li.eq(this.current),c.addClass("cbp-slider-item-next"),c.animate({opacity:1},function(){e.removeClass("cbp-slider-item-current"),c.removeClass("cbp-slider-item-next").addClass("cbp-slider-item-current").removeAttr("style");var b=a(".cbp-slider-bullet");b.removeClass("cbp-slider-bullet-current"),b.eq(d.current).addClass("cbp-slider-bullet-current")})},getIndex:function(a){return a%=this.$liLength,0>a&&(a=this.$liLength+a),a}},i={_main:function(b,c,d){var e=this;e.styleQueue=[],e.isAnimating=!1,e.defaultFilter="*",e.registeredEvents=[],a.isFunction(d)&&e._registerEvent("initFinish",d,!0),e._extendOptions(c),e.obj=b,e.$obj=a(b),e.width=e.$obj.width(),e.$obj.addClass("cbp cbp-loading"),e.$ul=e.$obj.children(),e.$ul.addClass("cbp-wrapper"),("lazyLoading"===e.options.displayType||"fadeIn"===e.options.displayType)&&e.$ul.css({opacity:0}),"fadeInToTop"===e.options.displayType&&e.$ul.css({opacity:0,marginTop:30}),e._browserInfo(),e._initCSSandEvents(),e._prepareBlocks(),"lazyLoading"===e.options.displayType||"sequentially"===e.options.displayType||"bottomToTop"===e.options.displayType||"fadeInToTop"===e.options.displayType?e._load():e._beforeDisplay()},_extendOptions:function(b){var c=this;b&&!b.hasOwnProperty("lightboxCounter")&&b.lightboxShowCounter===!1&&(b.lightboxCounter=""),b&&!b.hasOwnProperty("singlePageCounter")&&b.singlePageShowCounter===!1&&(b.singlePageCounter=""),c.options=a.extend({},a.fn.cubeportfolio.options,b)},_browserInfo:function(){var a,c,d=this,e=navigator.appVersion;d.browser=-1!==e.indexOf("MSIE 8.")?"ie8":-1!==e.indexOf("MSIE 9.")?"ie9":-1!==e.indexOf("MSIE 10.")?"ie10":b.ActiveXObject||"ActiveXObject"in b?"ie11":/android/gi.test(e)?"android":/iphone|ipad|ipod/gi.test(e)?"ios":/chrome/gi.test(e)?"chrome":"",d.browser&&d.$obj.addClass("cbp-"+d.browser),a=d._styleSupport("transition"),c=d._styleSupport("animation"),d.transition=d.transitionByFilter=a?"css":"animate","animate"!==d.transition&&(d.transitionEnd={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"}[a],d.animationEnd={WebkitAnimation:"webkitAnimationEnd",MozAnimation:"Animationend",OAnimation:"oAnimationEnd oanimationend",animation:"animationend"}[c],d.supportCSSTransform=d._styleSupport("transform"),d.supportCSSTransform&&d._cssHooks())},_styleSupport:function(a){var b,d,e,f=a.charAt(0).toUpperCase()+a.slice(1),g=["Moz","Webkit","O","ms"],h=c.createElement("div");if(a in h.style)d=a;else for(e=g.length-1;e>=0;e--)if(b=g[e]+f,b in h.style){d=b;break}return h=null,d},_cssHooks:function(){function b(b,e,f){var g,h,i,j,k,l,m=a(b),n=m.data("transformFn")||{},o={},p={};o[f]=e,a.extend(n,o);for(g in n)n.hasOwnProperty(g)&&(h=n[g],p[g]=c[g](h));i=p.translate||"",j=p.scale||"",l=p.skew||"",k=i+j+l,m.data("transformFn",n),b.style[d.supportCSSTransform]=k}var c,d=this;c=d._has3d()?{translate:function(a){return"translate3d("+a[0]+"px, "+a[1]+"px, 0) "},scale:function(a){return"scale3d("+a+", "+a+", 1) "},skew:function(a){return"skew("+a[0]+"deg, "+a[1]+"deg) "}}:{translate:function(a){return"translate("+a[0]+"px, "+a[1]+"px) "},scale:function(a){return"scale("+a+") "},skew:function(a){return"skew("+a[0]+"deg, "+a[1]+"deg) "}},a.cssNumber.scale=!0,a.cssHooks.scale={set:function(a,c){"string"==typeof c&&(c=parseFloat(c)),b(a,c,"scale")},get:function(b){var c=a.data(b,"transformFn");return c&&c.scale?c.scale:1}},a.fx.step.scale=function(b){a.cssHooks.scale.set(b.elem,b.now+b.unit)},a.cssNumber.translate=!0,a.cssHooks.translate={set:function(a,c){b(a,c,"translate")},get:function(b){var c=a.data(b,"transformFn");return c&&c.translate?c.translate:[0,0]}},a.cssNumber.skew=!0,a.cssHooks.skew={set:function(a,c){b(a,c,"skew")},get:function(b){var c=a.data(b,"transformFn");return c&&c.skew?c.skew:[0,0]}}},_has3d:function(){var a,e,f=c.createElement("p"),g={webkitTransform:"-webkit-transform",OTransform:"-o-transform",msTransform:"-ms-transform",MozTransform:"-moz-transform",transform:"transform"};c.body.insertBefore(f,null);for(a in g)g.hasOwnProperty(a)&&f.style[a]!==d&&(f.style[a]="translate3d(1px,1px,1px)",e=b.getComputedStyle(f).getPropertyValue(g[a]));return c.body.removeChild(f),e!==d&&e.length>0&&"none"!==e},_prepareBlocks:function(){var a=this;a.blocks=a.$ul.children(".cbp-item"),a.blocksAvailable=a.blocks,a.blocks.wrapInner('<div class="cbp-item-wrapper"></div>'),a.options.caption&&a._captionInit()},_captionInit:function(){var a=this;a.$obj.addClass("cbp-caption-"+a.options.caption),a["_"+a.options.caption+"Caption"]()},_captionDestroy:function(){var a=this;a.$obj.removeClass("cbp-caption-"+a.options.caption),a["_"+a.options.caption+"CaptionDestroy"]()},_noneCaption:function(){},_noneCaptionDestroy:function(){},_pushTopCaption:function(){var b=this;("ie8"===b.browser||"ie9"===b.browser)&&a(".cbp-caption").on("mouseenter"+f,function(){var b=a(this),c=b.find(".cbp-caption-defaultWrap"),d=b.find(".cbp-caption-activeWrap");c.animate({bottom:"100%"},"fast"),d.animate({bottom:0},"fast")}).on("mouseleave"+f,function(){var b=a(this),c=b.find(".cbp-caption-defaultWrap"),d=b.find(".cbp-caption-activeWrap");c.animate({bottom:0},"fast"),d.animate({bottom:"-100%"},"fast")})},_pushTopCaptionDestroy:function(){var b=this,c=a(".cbp-caption");("ie8"===b.browser||"ie9"===b.browser)&&(c.off("mouseenter"+f+" mouseleave"+f),c.find(".cbp-caption-defaultWrap").removeAttr("style"),c.find(".cbp-caption-activeWrap").removeAttr("style"))},_pushDownCaption:function(){var b=this;("ie8"===b.browser||"ie9"===b.browser)&&a(".cbp-caption").on("mouseenter"+f,function(){var b=a(this),c=b.find(".cbp-caption-defaultWrap"),d=b.find(".cbp-caption-activeWrap");c.animate({bottom:"-100%"},"fast"),d.animate({bottom:0},"fast")}).on("mouseleave"+f,function(){var b=a(this),c=b.find(".cbp-caption-defaultWrap"),d=b.find(".cbp-caption-activeWrap");c.animate({bottom:0},"fast"),d.animate({bottom:"100%"},"fast")})},_pushDownCaptionDestroy:function(){var b=this,c=a(".cbp-caption");("ie8"===b.browser||"ie9"===b.browser)&&(c.off("mouseenter"+f+" mouseleave"+f),c.find(".cbp-caption-defaultWrap").removeAttr("style"),c.find(".cbp-caption-activeWrap").removeAttr("style"))},_revealBottomCaption:function(){var b=this;("ie8"===b.browser||"ie9"===b.browser)&&a(".cbp-caption").on("mouseenter"+f,function(){var b=a(this),c=b.find(".cbp-caption-defaultWrap");c.animate({bottom:"100%"},"fast")}).on("mouseleave"+f,function(){var b=a(this),c=b.find(".cbp-caption-defaultWrap");c.animate({bottom:0},"fast")})},_revealBottomCaptionDestroy:function(){var b=this,c=a(".cbp-caption");("ie8"===b.browser||"ie9"===b.browser)&&(c.off("mouseenter"+f+" mouseleave"+f),c.find(".cbp-caption-defaultWrap").removeAttr("style"))},_revealTopCaption:function(){var b=this;("ie8"===b.browser||"ie9"===b.browser)&&a(".cbp-caption").on("mouseenter"+f,function(){var b=a(this),c=b.find(".cbp-caption-defaultWrap");c.animate({bottom:"-100%"},"fast")}).on("mouseleave"+f,function(){var b=a(this),c=b.find(".cbp-caption-defaultWrap");c.animate({bottom:0},"fast")})},_revealTopCaptionDestroy:function(){var b=this,c=a(".cbp-caption");("ie8"===b.browser||"ie9"===b.browser)&&(c.off("mouseenter"+f+" mouseleave"+f),c.find(".cbp-caption-defaultWrap").removeAttr("style"))},_overlayBottomRevealCaption:function(){var b=this;("ie8"===b.browser||"ie9"===b.browser)&&a(".cbp-caption").on("mouseenter"+f,function(){var b=a(this),c=b.find(".cbp-caption-defaultWrap"),d=b.find(".cbp-caption-activeWrap").height();c.animate({bottom:d},"fast")}).on("mouseleave"+f,function(){var b=a(this),c=b.find(".cbp-caption-defaultWrap");c.animate({bottom:0},"fast")})},_overlayBottomRevealCaptionDestroy:function(){var b=this,c=a(".cbp-caption");("ie8"===b.browser||"ie9"===b.browser)&&(c.off("mouseenter"+f+" mouseleave"+f),c.find(".cbp-caption-defaultWrap").removeAttr("style"))},_overlayBottomPushCaption:function(){var b=this;("ie8"===b.browser||"ie9"===b.browser)&&a(".cbp-caption").on("mouseenter"+f,function(){var b=a(this),c=b.find(".cbp-caption-defaultWrap"),d=b.find(".cbp-caption-activeWrap"),e=d.height();c.animate({bottom:e},"fast"),d.animate({bottom:0},"fast")}).on("mouseleave"+f,function(){var b=a(this),c=b.find(".cbp-caption-defaultWrap"),d=b.find(".cbp-caption-activeWrap"),e=d.height();c.animate({bottom:0},"fast"),d.animate({bottom:-e},"fast")})},_overlayBottomPushCaptionDestroy:function(){var b=this,c=a(".cbp-caption");("ie8"===b.browser||"ie9"===b.browser)&&(c.off("mouseenter"+f+" mouseleave"+f),c.find(".cbp-caption-defaultWrap").removeAttr("style"),c.find(".cbp-caption-activeWrap").removeAttr("style"))},_overlayBottomCaption:function(){var b=this;("ie8"===b.browser||"ie9"===b.browser)&&a(".cbp-caption").on("mouseenter"+f,function(){a(this).find(".cbp-caption-activeWrap").animate({bottom:0},"fast")}).on("mouseleave"+f,function(){var b=a(this).find(".cbp-caption-activeWrap");b.animate({bottom:-b.height()},"fast")})},_overlayBottomCaptionDestroy:function(){var b=this,c=a(".cbp-caption");("ie8"===b.browser||"ie9"===b.browser)&&(c.off("mouseenter"+f+" mouseleave"+f),c.find(".cbp-caption-activeWrap").removeAttr("style"))},_moveRightCaption:function(){var b=this;("ie8"===b.browser||"ie9"===b.browser)&&a(".cbp-caption").on("mouseenter"+f,function(){a(this).find(".cbp-caption-activeWrap").animate({left:0},"fast")}).on("mouseleave"+f,function(){var b=a(this).find(".cbp-caption-activeWrap");b.animate({left:-b.width()},"fast")})},_moveRightCaptionDestroy:function(){var b=this,c=a(".cbp-caption");("ie8"===b.browser||"ie9"===b.browser)&&(c.off("mouseenter"+f+" mouseleave"+f),c.find(".cbp-caption-activeWrap").removeAttr("style"))},_revealLeftCaption:function(){var b=this;("ie8"===b.browser||"ie9"===b.browser)&&a(".cbp-caption").on("mouseenter"+f,function(){a(this).find(".cbp-caption-activeWrap").animate({left:0},"fast")}).on("mouseleave"+f,function(){var b=a(this).find(".cbp-caption-activeWrap");b.animate({left:b.width()},"fast")})},_revealLeftCaptionDestroy:function(){var b=this,c=a(".cbp-caption");("ie8"===b.browser||"ie9"===b.browser)&&(c.off("mouseenter"+f+" mouseleave"+f),c.find(".cbp-caption-activeWrap").removeAttr("style"))},_minimalCaption:function(){},_minimalCaptionDestroy:function(){},_fadeInCaption:function(){var b,c=this;("ie8"===c.browser||"ie9"===c.browser)&&(b="ie9"===c.browser?1:.8,a(".cbp-caption").on("mouseenter"+f,function(){a(this).find(".cbp-caption-activeWrap").animate({opacity:b},"fast")}).on("mouseleave"+f,function(){a(this).find(".cbp-caption-activeWrap").animate({opacity:0},"fast")}))},_fadeInCaptionDestroy:function(){var b=this,c=a(".cbp-caption");("ie8"===b.browser||"ie9"===b.browser)&&(c.off("mouseenter"+f+" mouseleave"+f),c.find(".cbp-caption-activeWrap").removeAttr("style"))},_overlayRightAlongCaption:function(){var b=this;("ie8"===b.browser||"ie9"===b.browser)&&a(".cbp-caption").on("mouseenter"+f,function(){var b=a(this),c=b.find(".cbp-caption-defaultWrap"),d=b.find(".cbp-caption-activeWrap");c.animate({left:d.width()/2},"fast"),d.animate({left:0},"fast")}).on("mouseleave"+f,function(){var b=a(this),c=b.find(".cbp-caption-defaultWrap"),d=b.find(".cbp-caption-activeWrap");c.animate({left:0},"fast"),d.animate({left:-d.width()},"fast")})},_overlayRightAlongCaptionDestroy:function(){var b=this,c=a(".cbp-caption");("ie8"===b.browser||"ie9"===b.browser)&&(c.off("mouseenter"+f+" mouseleave"+f),c.find(".cbp-caption-defaultWrap").removeAttr("style"),c.find(".cbp-caption-activeWrap").removeAttr("style"))},_overlayBottomAlongCaption:function(){var b=this;("ie8"===b.browser||"ie9"===b.browser)&&a(".cbp-caption").on("mouseenter"+f,function(){var b=a(this),c=b.find(".cbp-caption-defaultWrap"),d=b.find(".cbp-caption-activeWrap");c.animate({bottom:d.height()/2},"fast"),d.animate({bottom:0},"fast")}).on("mouseleave"+f,function(){var b=a(this),c=b.find(".cbp-caption-defaultWrap"),d=b.find(".cbp-caption-activeWrap");c.animate({bottom:0},"fast"),d.animate({bottom:-d.height()},"fast")})},_overlayBottomAlongCaptionDestroy:function(){var b=this,c=a(".cbp-caption");("ie8"===b.browser||"ie9"===b.browser)&&(c.off("mouseenter"+f+" mouseleave"+f),c.find(".cbp-caption-defaultWrap").removeAttr("style"),c.find(".cbp-caption-activeWrap").removeAttr("style"))},_zoomCaption:function(){var b,c=this;("ie8"===c.browser||"ie9"===c.browser)&&(b="ie9"===c.browser?1:.8,a(".cbp-caption").on("mouseenter"+f,function(){a(this).find(".cbp-caption-activeWrap").animate({opacity:b},"fast")}).on("mouseleave"+f,function(){a(this).find(".cbp-caption-activeWrap").animate({opacity:0},"fast")}))},_zoomCaptionDestroy:function(){var b=this,c=a(".cbp-caption");("ie8"===b.browser||"ie9"===b.browser)&&(c.off("mouseenter"+f+" mouseleave"+f),c.find(".cbp-caption-activeWrap").removeAttr("style"))},_initCSSandEvents:function(){var c,e,g,h,i=this;a(b).on("resize"+f,function(){c&&clearTimeout(c),c=setTimeout(function(){if("ie8"===i.browser){if(h=a(b).width(),g!==d&&g===h)return;g=h}i.$obj.removeClass("cbp-no-transition cbp-appendItems-loading"),"responsive"===i.options.gridAdjustment&&i._responsiveLayout(),i._layout(),i._processStyle(i.transition),i._resizeMainContainer(i.transition),i.lightbox&&i.lightbox.resizeImage(),i.singlePage&&i.singlePage.options.singlePageStickyNavigation&&(e=i.singlePage.wrap[0].clientWidth,e>0&&(i.singlePage.navigationWrap.width(e),i.singlePage.navigation.width(e))),i.singlePageInline&&i.singlePageInline.isOpen&&i.singlePageInline.close()
},50)})},_load:function(){var b,c,d,e=this,g=[],h=/url\((['"]?)(.*?)\1\)/g;if(d=e.$obj.children().css("backgroundImage"))for(var i;i=h.exec(d);)g.push({src:i[2]});e.$obj.find("*").each(function(){var b=a(this);if(b.is("img:uncached")&&g.push({src:b.attr("src"),element:b[0]}),d=b.css("backgroundImage"))for(var c;c=h.exec(d);)g.push({src:c[2],element:b[0]})});var j=g.length,k=0;0===j&&e._beforeDisplay();var l=function(){return k++,k===j?(e._beforeDisplay(),!1):void 0};for(b=0;j>b;b++)c=new Image,a(c).on("load"+f+" error"+f,l),c.src=g[b].src},_beforeDisplay:function(){var a=this;a.options.animationType&&(a["_"+a.options.animationType+"Init"]&&a["_"+a.options.animationType+"Init"](),a.$obj.addClass("cbp-animation-"+a.options.animationType),a.localColumnWidth=a.blocks.eq(0).outerWidth()+a.options.gapVertical,a._filterFromUrl(),""===a.options.defaultFilter||"*"===a.options.defaultFilter?a._display():a.filter(a.options.defaultFilter,function(){a._display()},a))},_filterFromUrl:function(){var a=this,b=/#cbpf=(.*?)([#|?&]|$)/gi.exec(location.href);null!==b&&(a.options.defaultFilter=b[1])},_display:function(){var b,d,e=this,h=a(c.body);"responsive"===e.options.gridAdjustment&&e._responsiveLayout(),e._layout(),e._processStyle("css"),e._resizeMainContainer("css"),("lazyLoading"===e.options.displayType||"fadeIn"===e.options.displayType)&&e.$ul.animate({opacity:1},e.options.displayTypeSpeed),"fadeInToTop"===e.options.displayType&&e.$ul.animate({opacity:1,marginTop:0},e.options.displayTypeSpeed,function(){e.$ul.css({marginTop:0}),e.$ulClone.css({marginTop:0})}),"sequentially"===e.options.displayType&&(b=0,e.blocks.css("opacity",0),function i(){d=e.blocksAvailable.eq(b++),d.length&&(d.animate({opacity:1}),setTimeout(i,e.options.displayTypeSpeed))}()),"bottomToTop"===e.options.displayType&&(b=0,e.blocks.css({opacity:0,marginTop:80}),function j(){d=e.blocksAvailable.eq(b++),d.length?(d.animate({opacity:1,marginTop:0},400),setTimeout(j,e.options.displayTypeSpeed)):(e.blocks.css({marginTop:0}),e.blocksClone&&e.blocksClone.css({marginTop:0}))}()),setTimeout(function(){e.$obj.removeClass("cbp-loading"),e._triggerEvent("initFinish"),e.$obj.trigger("initComplete"+f),e.$obj.addClass("cbp-ready")},0),e.lightbox=null,e.$obj.find(e.options.lightboxDelegate)&&(e.lightbox=Object.create(g),e.lightbox.init(e,"lightbox"),e.$obj.on("click"+f,e.options.lightboxDelegate,function(b){b.preventDefault();var c=a(this);c.closest(a(".cbp-popup-singlePageInline")).length||e.lightbox.openLightbox(e.blocksAvailable.find(e.options.lightboxDelegate),this)})),1!=h.data("cbpLightboxIsOn")&&(h.on("click"+f,e.options.lightboxDelegate,function(b){b.preventDefault();var c=a(this),d=c.data("cbpLightbox");c.closest(a(".cbp-wrapper")).length||(d?e.lightbox.openLightbox(a(e.options.lightboxDelegate).filter("[data-cbp-lightbox="+d+"]"),this):e.lightbox.openLightbox(c,this))}),h.data("cbpLightboxIsOn",!0)),e.singlePage=null,e.$obj.find(e.options.singlePageDelegate)&&(e.singlePage=Object.create(g),e.singlePage.init(e,"singlePage"),e.$obj.on("click"+f,e.options.singlePageDelegate,function(a){a.preventDefault(),e.singlePage.openSinglePage(e.blocksAvailable.find(e.options.singlePageDelegate),this)})),1!=h.data("cbpSinglePageIsOn")&&(h.on("click"+f,e.options.singlePageDelegate,function(b){b.preventDefault();var c=a(this),d=c.data("cbpSinglepage");c.closest(a(".cbp")).length||(d?e.singlePage.openSinglePage(a(e.options.singlePageDelegate).filter("[data-cbp-singlePage="+d+"]"),this):e.singlePage.openSinglePage(c,this))}),h.data("cbpSinglePageIsOn",!0)),e.singlePageInline=null,e.$obj.find(e.options.singlePageInlineDelegate)&&(e.singlePageInline=Object.create(g),e.singlePageInline.init(e,"singlePageInline"),e.$obj.on("click"+f,e.options.singlePageInlineDelegate,function(a){a.preventDefault(),e.singlePageInline.openSinglePageInline(e.blocksAvailable,this)}))},_layout:function(){var b=this;b._layoutReset(),b.blocksAvailable.each(function(c,d){var e=a(d),f=Math.ceil(e.outerWidth()/b.localColumnWidth),g=0;if(f=Math.min(f,b.cols),b.singlePageInline&&c>=b.singlePageInline.matrice[0]&&c<=b.singlePageInline.matrice[1]&&(g=b.singlePageInline.height),1===f)b._placeBlocks(e,b.colVert,g);else{var h,i,j=b.cols+1-f,k=[];for(i=0;j>i;i++)h=b.colVert.slice(i,i+f),k[i]=Math.max.apply(Math,h);b._placeBlocks(e,k,g)}}),b.$obj.removeClass(function(a,b){return(b.match(/\bcbp-cols-\d+/gi)||[]).join(" ")}),b.$obj.addClass("cbp-cols-"+b.cols)},_layoutReset:function(){var a,b=this;for("alignCenter"===b.options.gridAdjustment?(b.$obj.attr("style",""),b.width=b.$obj.width(),b.cols=Math.max(Math.floor((b.width+b.options.gapVertical)/b.localColumnWidth),1),b.width=b.cols*b.localColumnWidth-b.options.gapVertical,b.$obj.css("max-width",b.width)):(b.width=b.$obj.width(),b.cols=Math.max(Math.floor((b.width+b.options.gapVertical)/b.localColumnWidth),1)),b.colVert=[],a=b.cols;a--;)b.colVert.push(0)},_responsiveLayout:function(){var b,c,d=this;d.columnWidthCache?d.localColumnWidth=d.columnWidthCache:d.columnWidthCache=d.localColumnWidth,d.width=d.$obj.outerWidth()+d.options.gapVertical,d.cols=Math.max(Math.round(d.width/d.localColumnWidth),1),c=d.width-d.options.gapVertical*d.cols,d.localColumnWidth=parseInt(c/d.cols,10)+d.options.gapVertical,b=d.localColumnWidth/d.columnWidthCache,d.blocks.each(function(){var c=a(this),e=a.data(this,"cbp-wxh");e||(e=a.data(this,"cbp-wxh",{width:c.outerWidth(),height:c.outerHeight()})),c.css("width",d.localColumnWidth-d.options.gapVertical),c.css("height",Math.floor(e.height*b))}),d.blocksClone&&d.blocksClone.each(function(){var c=a(this),e=a.data(this,"cbp-wxh");e||(e=a.data(this,"cbp-wxh",{width:c.outerWidth(),height:c.outerHeight()})),c.css("width",d.localColumnWidth-d.options.gapVertical),c.css("height",Math.floor(e.height*b))})},_resizeMainContainer:function(a,b){var c=this;b=b||0,c.height=Math.max.apply(Math,c.colVert)+b,c.$obj[a]({height:c.height-c.options.gapHorizontal},400)},_processStyle:function(a){for(var b=this,c=b.styleQueue.length-1;c>=0;c--)b.styleQueue[c].$el[a](b.styleQueue[c].style);b.styleQueue=[]},_placeBlocks:function(a,b,c){var d,e,f,g,h,i,j=this,k=Math.min.apply(Math,b),l=0;for(h=0,i=b.length;i>h;h++)if(b[h]===k){l=h;break}for(j.singlePageInline&&0!==c&&(j.singlePageInline.top=k),k+=c,d=Math.round(j.localColumnWidth*l),e=Math.round(k),j.styleQueue.push({$el:a,style:j.supportCSSTransform?j._withCSS3(d,e):j._withCSS2(d,e)}),f=k+a.outerHeight()+j.options.gapHorizontal,g=j.cols+1-i,h=0;g>h;h++)j.colVert[l+h]=f},_withCSS2:function(a,b){return{left:a,top:b}},_withCSS3:function(a,b){return{translate:[a,b]}},_duplicateContent:function(a){var b=this;b.$ulClone=b.$ul.clone(),b.blocksClone=b.$ulClone.children(),b.$ulClone.css(a),b.ulHidden="clone",b.$obj.append(b.$ulClone)},_fadeOutFilter:function(a,b,c){var d=this;"*"!==c&&(b=b.filter(c),a=d.blocks.not(".cbp-item-hidden").not(c).addClass("cbp-item-hidden")),b.removeClass("cbp-item-hidden"),d.blocksAvailable=d.blocks.filter(c),a.length&&d.styleQueue.push({$el:a,style:{opacity:0}}),b.length&&d.styleQueue.push({$el:b,style:{opacity:1}}),d._layout(),d._processStyle(d.transitionByFilter),d._resizeMainContainer(d.transition),setTimeout(function(){d._filterFinish()},400)},_quicksandFilter:function(a,b,c){var d=this;"*"!==c&&(b=b.filter(c),a=d.blocks.not(".cbp-item-hidden").not(c).addClass("cbp-item-hidden")),b.removeClass("cbp-item-hidden"),d.blocksAvailable=d.blocks.filter(c),a.length&&d.styleQueue.push({$el:a,style:{scale:.01,opacity:0}}),b.length&&d.styleQueue.push({$el:b,style:{scale:1,opacity:1}}),d._layout(),d._processStyle(d.transitionByFilter),d._resizeMainContainer(d.transition),setTimeout(function(){d._filterFinish()},400)},_flipOutFilter:function(a,b,c){var d=this;"*"!==c&&(b=b.filter(c),a=d.blocks.not(".cbp-item-hidden").not(c).addClass("cbp-item-hidden")),b.removeClass("cbp-item-hidden"),d.blocksAvailable=d.blocks.filter(c),a.length&&("ie8"===d.browser||"ie9"===d.browser?d.styleQueue.push({$el:a,style:{opacity:0}}):a.find(".cbp-item-wrapper").removeClass("cbp-animation-flipOut-in").addClass("cbp-animation-flipOut-out")),b.length&&("ie8"===d.browser||"ie9"===d.browser?d.styleQueue.push({$el:b,style:{opacity:1}}):b.find(".cbp-item-wrapper").removeClass("cbp-animation-flipOut-out").addClass("cbp-animation-flipOut-in")),d._layout(),d._processStyle(d.transitionByFilter),d._resizeMainContainer(d.transition),setTimeout(function(){d._filterFinish()},400)},_flipBottomFilter:function(a,b,c){var d=this;"*"!==c&&(b=b.filter(c),a=d.blocks.not(".cbp-item-hidden").not(c).addClass("cbp-item-hidden")),b.removeClass("cbp-item-hidden"),d.blocksAvailable=d.blocks.filter(c),a.length&&("ie8"===d.browser||"ie9"===d.browser?d.styleQueue.push({$el:a,style:{opacity:0}}):a.find(".cbp-item-wrapper").removeClass("cbp-animation-flipBottom-in").addClass("cbp-animation-flipBottom-out")),b.length&&("ie8"===d.browser||"ie9"===d.browser?d.styleQueue.push({$el:b,style:{opacity:1}}):b.find(".cbp-item-wrapper").removeClass("cbp-animation-flipBottom-out").addClass("cbp-animation-flipBottom-in")),d._layout(),d._processStyle(d.transitionByFilter),d._resizeMainContainer(d.transition),setTimeout(function(){d._filterFinish()},400)},_scaleSidesFilter:function(a,b,c){var d=this;"*"!==c&&(b=b.filter(c),a=d.blocks.not(".cbp-item-hidden").not(c).addClass("cbp-item-hidden")),b.removeClass("cbp-item-hidden"),d.blocksAvailable=d.blocks.filter(c),a.length&&("ie8"===d.browser||"ie9"===d.browser?d.styleQueue.push({$el:a,style:{opacity:0}}):a.find(".cbp-item-wrapper").removeClass("cbp-animation-scaleSides-in").addClass("cbp-animation-scaleSides-out")),b.length&&("ie8"===d.browser||"ie9"===d.browser?d.styleQueue.push({$el:b,style:{opacity:1}}):b.find(".cbp-item-wrapper").removeClass("cbp-animation-scaleSides-out").addClass("cbp-animation-scaleSides-in")),d._layout(),d._processStyle(d.transitionByFilter),d._resizeMainContainer(d.transition),setTimeout(function(){d._filterFinish()},400)},_skewFilter:function(a,b,c){var d=this;"*"!==c&&(b=b.filter(c),a=d.blocks.not(".cbp-item-hidden").not(c).addClass("cbp-item-hidden")),b.removeClass("cbp-item-hidden"),d.blocksAvailable=d.blocks.filter(c),a.length&&d.styleQueue.push({$el:a,style:{skew:[50,0],scale:.01,opacity:0}}),b.length&&d.styleQueue.push({$el:b,style:{skew:[0,0],scale:1,opacity:1}}),d._layout(),d._processStyle(d.transitionByFilter),d._resizeMainContainer(d.transition),setTimeout(function(){d._filterFinish()},400)},_sequentiallyInit:function(){this.transitionByFilter="css"},_sequentiallyFilter:function(a,b,c){var d=this,e=d.blocksAvailable;d.blocksAvailable=d.blocks.filter(c),d.$obj.addClass("cbp-no-transition"),"ie8"===d.browser||"ie9"===d.browser?e[d.transition]({top:"-=30",opacity:0},300):e[d.transition]({top:-30,opacity:0}),setTimeout(function(){"*"!==c&&(b=b.filter(c),a=d.blocks.not(".cbp-item-hidden").not(c).addClass("cbp-item-hidden")),b.removeClass("cbp-item-hidden"),a.length&&a.css({display:"none"}),b.length&&b.css("display","block"),d._layout(),d._processStyle(d.transitionByFilter),d._resizeMainContainer(d.transition),("ie8"===d.browser||"ie9"===d.browser)&&d.blocksAvailable.css("top","-=30");var e,f=0;!function g(){e=d.blocksAvailable.eq(f++),e.length?(e[d.transition]("ie8"===d.browser||"ie9"===d.browser?{top:"+=30",opacity:1}:{top:0,opacity:1}),setTimeout(g,130)):setTimeout(function(){d._filterFinish()},600)}()},600)},_fadeOutTopInit:function(){this.transitionByFilter="css"},_fadeOutTopFilter:function(a,b,c){var d=this;d.blocksAvailable=d.blocks.filter(c),"ie8"===d.browser||"ie9"===d.browser?d.$ul[d.transition]({top:-30,opacity:0},350):d.$ul[d.transition]({top:-30,opacity:0}),d.$obj.addClass("cbp-no-transition"),setTimeout(function(){"*"!==c&&(b=b.filter(c),a=d.blocks.not(".cbp-item-hidden").not(c).addClass("cbp-item-hidden")),b.removeClass("cbp-item-hidden"),a.length&&a.css("opacity",0),b.length&&b.css("opacity",1),d._layout(),d._processStyle(d.transitionByFilter),d._resizeMainContainer(d.transition),"ie8"===d.browser||"ie9"===d.browser?d.$ul[d.transition]({top:0,opacity:1},350):d.$ul[d.transition]({top:0,opacity:1}),setTimeout(function(){d._filterFinish()},400)},400)},_boxShadowInit:function(){var a=this;"ie8"===a.browser||"ie9"===a.browser?a.options.animationType="fadeOut":a.blocksAvailable.append('<div class="cbp-animation-boxShadowMask"></div>')},_boxShadowFilter:function(a,b,c){var d=this;"*"!==c&&(b=b.filter(c),a=d.blocks.not(".cbp-item-hidden").not(c).addClass("cbp-item-hidden")),b.removeClass("cbp-item-hidden");var e=d.blocks.find(".cbp-animation-boxShadowMask");e.addClass("cbp-animation-boxShadowShow"),e.removeClass("cbp-animation-boxShadowActive cbp-animation-boxShadowInactive"),d.blocksAvailable=d.blocks.filter(c);var f={};a.length&&(a.find(".cbp-animation-boxShadowMask").addClass("cbp-animation-boxShadowActive"),d.styleQueue.push({$el:a,style:{opacity:0}}),f=a.last()),b.length&&(b.find(".cbp-animation-boxShadowMask").addClass("cbp-animation-boxShadowInactive"),d.styleQueue.push({$el:b,style:{opacity:1}}),f=b.last()),d._layout(),f.length?f.one(d.transitionEnd,function(){e.removeClass("cbp-animation-boxShadowShow"),d._filterFinish()}):(e.removeClass("cbp-animation-boxShadowShow"),d._filterFinish()),d._processStyle(d.transitionByFilter),d._resizeMainContainer(d.transition)},_bounceLeftInit:function(){var a=this;a._duplicateContent({left:"-100%",opacity:0}),a.transitionByFilter="css",a.$ul.addClass("cbp-wrapper-front")},_bounceLeftFilter:function(a,b,c){var d,e,f,g=this;g.$obj.addClass("cbp-no-transition"),"clone"===g.ulHidden?(g.ulHidden="first",d=g.$ulClone,f=g.$ul,e=g.blocksClone):(g.ulHidden="clone",d=g.$ul,f=g.$ulClone,e=g.blocks),b=e.filter(".cbp-item-hidden"),"*"!==c&&(b=b.filter(c),e.not(".cbp-item-hidden").not(c).addClass("cbp-item-hidden")),b.removeClass("cbp-item-hidden"),g.blocksAvailable=e.filter(c),g._layout(),f[g.transition]({left:"-100%",opacity:0}).removeClass("cbp-wrapper-front").addClass("cbp-wrapper-back"),d[g.transition]({left:0,opacity:1}).addClass("cbp-wrapper-front").removeClass("cbp-wrapper-back"),g._processStyle(g.transitionByFilter),g._resizeMainContainer(g.transition),setTimeout(function(){g._filterFinish()},400)},_bounceTopInit:function(){var a=this;a._duplicateContent({top:"-100%",opacity:0}),a.transitionByFilter="css",a.$ul.addClass("cbp-wrapper-front")},_bounceTopFilter:function(a,b,c){var d,e,f,g=this;g.$obj.addClass("cbp-no-transition"),"clone"===g.ulHidden?(g.ulHidden="first",d=g.$ulClone,f=g.$ul,e=g.blocksClone):(g.ulHidden="clone",d=g.$ul,f=g.$ulClone,e=g.blocks),b=e.filter(".cbp-item-hidden"),"*"!==c&&(b=b.filter(c),e.not(".cbp-item-hidden").not(c).addClass("cbp-item-hidden")),b.removeClass("cbp-item-hidden"),g.blocksAvailable=e.filter(c),g._layout(),f[g.transition]({top:"-100%",opacity:0}).removeClass("cbp-wrapper-front").addClass("cbp-wrapper-back"),d[g.transition]({top:0,opacity:1}).addClass("cbp-wrapper-front").removeClass("cbp-wrapper-back"),g._processStyle(g.transitionByFilter),g._resizeMainContainer(g.transition),setTimeout(function(){g._filterFinish()},400)},_bounceBottomInit:function(){var a=this;a._duplicateContent({top:"100%",opacity:0}),a.transitionByFilter="css"},_bounceBottomFilter:function(a,b,c){var d,e,f,g=this;g.$obj.addClass("cbp-no-transition"),"clone"===g.ulHidden?(g.ulHidden="first",d=g.$ulClone,f=g.$ul,e=g.blocksClone):(g.ulHidden="clone",d=g.$ul,f=g.$ulClone,e=g.blocks),b=e.filter(".cbp-item-hidden"),"*"!==c&&(b=b.filter(c),e.not(".cbp-item-hidden").not(c).addClass("cbp-item-hidden")),b.removeClass("cbp-item-hidden"),g.blocksAvailable=e.filter(c),g._layout(),f[g.transition]({top:"100%",opacity:0}).removeClass("cbp-wrapper-front").addClass("cbp-wrapper-back"),d[g.transition]({top:0,opacity:1}).addClass("cbp-wrapper-front").removeClass("cbp-wrapper-back"),g._processStyle(g.transitionByFilter),g._resizeMainContainer(g.transition),setTimeout(function(){g._filterFinish()},400)},_moveLeftInit:function(){var a=this;a._duplicateContent({left:"100%",opacity:0}),a.$ulClone.addClass("no-trans"),a.transitionByFilter="css"},_moveLeftFilter:function(a,b,c){var d,e,f,g=this;"*"!==c&&(b=b.filter(c)),b.removeClass("cbp-item-hidden"),g.$obj.addClass("cbp-no-transition"),"clone"===g.ulHidden?(g.ulHidden="first",d=g.$ulClone,f=g.$ul,e=g.blocksClone):(g.ulHidden="clone",d=g.$ul,f=g.$ulClone,e=g.blocks),e.css("opacity",0),e.addClass("cbp-item-hidden"),g.blocksAvailable=e.filter(c),g.blocksAvailable.css("opacity",1),g.blocksAvailable.removeClass("cbp-item-hidden"),g._layout(),f[g.transition]({left:"-100%",opacity:0}),d.removeClass("no-trans"),"css"===g.transition?(d[g.transition]({left:0,opacity:1}),f.one(g.transitionEnd,function(){f.addClass("no-trans").css({left:"100%",opacity:0}),g._filterFinish()})):d[g.transition]({left:0,opacity:1},function(){f.addClass("no-trans").css({left:"100%",opacity:0}),g._filterFinish()}),g._processStyle(g.transitionByFilter),g._resizeMainContainer(g.transition)},_slideLeftInit:function(){var a=this;a._duplicateContent({}),a.$ul.addClass("cbp-wrapper-front"),a.$ulClone.css("opacity",0),a.transitionByFilter="css"},_slideLeftFilter:function(a,b,c){var d,e,f,g,h=this;h.blocks.show(),h.blocksClone.show(),"*"!==c&&(b=b.filter(c)),b.removeClass("cbp-item-hidden"),h.$obj.addClass("cbp-no-transition"),h.blocks.find(".cbp-item-wrapper").removeClass("cbp-animation-slideLeft-out cbp-animation-slideLeft-in"),h.blocksClone.find(".cbp-item-wrapper").removeClass("cbp-animation-slideLeft-out cbp-animation-slideLeft-in"),h.$ul.css({opacity:1}),h.$ulClone.css({opacity:1}),"clone"===h.ulHidden?(h.ulHidden="first",e=h.blocks,f=h.blocksClone,d=h.blocksClone,h.$ul.removeClass("cbp-wrapper-front"),h.$ulClone.addClass("cbp-wrapper-front")):(h.ulHidden="clone",e=h.blocksClone,f=h.blocks,d=h.blocks,h.$ul.addClass("cbp-wrapper-front"),h.$ulClone.removeClass("cbp-wrapper-front")),d.css("opacity",0),d.addClass("cbp-item-hidden"),h.blocksAvailable=d.filter(c),h.blocksAvailable.css({opacity:1}),h.blocksAvailable.removeClass("cbp-item-hidden"),h._layout(),"css"===h.transition?(e.find(".cbp-item-wrapper").addClass("cbp-animation-slideLeft-out"),f.find(".cbp-item-wrapper").addClass("cbp-animation-slideLeft-in"),g=e.find(".cbp-item-wrapper").last(),g.length?g.one(h.animationEnd,function(){h._filterFinish()}):h._filterFinish()):(e.find(".cbp-item-wrapper").animate({left:"-100%"},400,function(){h._filterFinish()}),f.find(".cbp-item-wrapper").css("left","100%"),f.find(".cbp-item-wrapper").animate({left:0},400)),h._processStyle(h.transitionByFilter),h._resizeMainContainer("animate")},_slideDelayInit:function(){this._wrapperFilterInit()},_slideDelayFilter:function(a,b,c){this._wrapperFilter(a,b,c,"slideDelay",!0)},_3dflipInit:function(){this._wrapperFilterInit()},_3dflipFilter:function(a,b,c){this._wrapperFilter(a,b,c,"3dflip",!0)},_rotateSidesInit:function(){this._wrapperFilterInit()},_rotateSidesFilter:function(a,b,c){this._wrapperFilter(a,b,c,"rotateSides",!0)},_flipOutDelayInit:function(){this._wrapperFilterInit()},_flipOutDelayFilter:function(a,b,c){this._wrapperFilter(a,b,c,"flipOutDelay",!1)},_foldLeftInit:function(){this._wrapperFilterInit()},_foldLeftFilter:function(a,b,c){this._wrapperFilter(a,b,c,"foldLeft",!0)},_unfoldInit:function(){this._wrapperFilterInit()},_unfoldFilter:function(a,b,c){this._wrapperFilter(a,b,c,"unfold",!0)},_scaleDownInit:function(){this._wrapperFilterInit()},_scaleDownFilter:function(a,b,c){this._wrapperFilter(a,b,c,"scaleDown",!0)},_frontRowInit:function(){this._wrapperFilterInit()},_frontRowFilter:function(a,b,c){this._wrapperFilter(a,b,c,"frontRow",!0)},_rotateRoomInit:function(){this._wrapperFilterInit()},_rotateRoomFilter:function(a,b,c){this._wrapperFilter(a,b,c,"rotateRoom",!0)},_wrapperFilterInit:function(){var a=this;a._duplicateContent({}),a.$ul.addClass("cbp-wrapper-front"),a.$ulClone.css("opacity",0),a.transitionByFilter="css"},_wrapperFilter:function(b,c,d,e,f){var g,h,i,j,k=this;if(k.blocks.show(),k.blocksClone.show(),"*"!==d&&(c=c.filter(d)),c.removeClass("cbp-item-hidden"),k.$obj.addClass("cbp-no-transition"),k.blocks.find(".cbp-item-wrapper").removeClass("cbp-animation-"+e+"-out cbp-animation-"+e+"-in cbp-animation-"+e+"-fadeOut").css("style",""),k.blocksClone.find(".cbp-item-wrapper").removeClass("cbp-animation-"+e+"-out cbp-animation-"+e+"-in cbp-animation-"+e+"-fadeOut").css("style",""),k.$ul.css({opacity:1}),k.$ulClone.css({opacity:1}),"clone"===k.ulHidden?(k.ulHidden="first",g=k.blocksClone,k.$ul.removeClass("cbp-wrapper-front"),k.$ulClone.addClass("cbp-wrapper-front")):(k.ulHidden="clone",g=k.blocks,k.$ul.addClass("cbp-wrapper-front"),k.$ulClone.removeClass("cbp-wrapper-front")),h=k.blocksAvailable,g.css("opacity",0),g.addClass("cbp-item-hidden"),k.blocksAvailable=g.filter(d),k.blocksAvailable.css({opacity:1}),k.blocksAvailable.removeClass("cbp-item-hidden"),i=k.blocksAvailable,k._layout(),"css"===k.transition){var l=0,m=0;i.each(function(b,c){a(c).find(".cbp-item-wrapper").addClass("cbp-animation-"+e+"-in").css("animation-delay",m/20+"s"),m++}),h.each(function(b,c){l>=m&&f?a(c).find(".cbp-item-wrapper").addClass("cbp-animation-"+e+"-fadeOut"):a(c).find(".cbp-item-wrapper").addClass("cbp-animation-"+e+"-out").css("animation-delay",l/20+"s"),l++}),j=h.find(".cbp-item-wrapper").first(),j.length?j.one(k.animationEnd,function(){k._filterFinish(),("ie10"===k.browser||"ie11"===k.browser)&&setTimeout(function(){a(".cbp-item-wrapper").removeClass("cbp-animation-"+e+"-in")},300)}):(k._filterFinish(),("ie10"===k.browser||"ie11"===k.browser)&&setTimeout(function(){a(".cbp-item-wrapper").removeClass("cbp-animation-"+e+"-in")},300))}else h.find(".cbp-item-wrapper").animate({left:"-100%"},400,function(){k._filterFinish()}),i.find(".cbp-item-wrapper").css("left","100%"),i.find(".cbp-item-wrapper").animate({left:0},400);k._processStyle(k.transitionByFilter),k._resizeMainContainer("animate")},_filterFinish:function(){var a=this;a.isAnimating=!1,a._triggerEvent("filterFinish"),a.$obj.trigger("filterComplete"+f)},_registerEvent:function(a,b,c){var d=this;d.registeredEvents[a]||(d.registeredEvents[a]=[],d.registeredEvents.push(a)),d.registeredEvents[a].push({func:b,oneTime:c||!1})},_triggerEvent:function(a){var b=this;if(b.registeredEvents[a])for(var c=b.registeredEvents[a].length-1;c>=0;c--)b.registeredEvents[a][c].func.call(b),b.registeredEvents[a][c].oneTime&&b.registeredEvents[a].splice(c,1)},init:function(b,c){var d=a.data(this,"cubeportfolio");if(d)throw new Error("cubeportfolio is already initialized. Please destroy it before initialize again!");d=a.data(this,"cubeportfolio",Object.create(i)),d._main(this,b,c)},destroy:function(c){var d=a.data(this,"cubeportfolio");if(!d)throw new Error("cubeportfolio is not initialized. Please initialize before calling destroy method!");a.isFunction(c)&&d._registerEvent("destroyFinish",c,!0),a.removeData(this,"cubeportfolio"),a.each(d.blocks,function(){a.removeData(this,"transformFn"),a.removeData(this,"cbp-wxh")}),d.$obj.removeClass("cbp cbp-loading cbp-ready cbp-no-transition"),d.$ul.removeClass("cbp-wrapper-front cbp-wrapper-back cbp-wrapper no-trans").removeAttr("style"),d.$obj.removeAttr("style"),d.$ulClone&&d.$ulClone.remove(),d.browser&&d.$obj.removeClass("cbp-"+d.browser),a(b).off("resize"+f),d.lightbox&&d.lightbox.destroy(),d.singlePage&&d.singlePage.destroy(),d.singlePageInline&&d.singlePageInline.destroy(),d.blocks.removeClass("cbp-item-hidden").removeAttr("style"),d.blocks.find(".cbp-item-wrapper").children().unwrap(),d.options.caption&&d._captionDestroy(),d.options.animationType&&("boxShadow"===d.options.animationType&&a(".cbp-animation-boxShadowMask").remove(),d.$obj.removeClass("cbp-animation-"+d.options.animationType)),d._triggerEvent("destroyFinish")},filter:function(b,c,d){var e,f,g,h=d||a.data(this,"cubeportfolio");if(!h)throw new Error("cubeportfolio is not initialized. Please initialize before calling filter method!");b="*"===b||""===b?"*":b,h.isAnimating||h.defaultFilter===b||("ie8"===h.browser||"ie9"===h.browser?h.$obj.removeClass("cbp-no-transition cbp-appendItems-loading"):(h.obj.classList.remove("cbp-no-transition"),h.obj.classList.remove("cbp-appendItems-loading")),h.defaultFilter=b,h.isAnimating=!0,a.isFunction(c)&&h._registerEvent("filterFinish",c,!0),e=h.blocks.filter(".cbp-item-hidden"),f=[],h.singlePageInline&&h.singlePageInline.isOpen?h.singlePageInline.close("promise",{callback:function(){h["_"+h.options.animationType+"Filter"](f,e,b)}}):h["_"+h.options.animationType+"Filter"](f,e,b),h.options.filterDeeplinking&&(g=location.href.replace(/#cbpf=(.*?)([#|?&]|$)/gi,""),location.href=g+"#cbpf="+b,h.singlePage&&h.singlePage.url&&(h.singlePage.url=location.href)))},showCounter:function(b,c){var d=a.data(this,"cubeportfolio");if(!d)throw new Error("cubeportfolio is not initialized. Please initialize before calling showCounter method!");d.elems=b,a.each(b,function(){var b,c=a(this),e=c.data("filter");e="*"===e||""===e?"*":e,b=d.blocks.filter(e).length,c.find(".cbp-filter-counter").text(b)}),a.isFunction(c)&&c.call(d)},appendItems:function(b,c){var d=this,e=a.data(d,"cubeportfolio");if(!e)throw new Error("cubeportfolio is not initialized. Please initialize before calling appendItems method!");e.singlePageInline&&e.singlePageInline.isOpen?e.singlePageInline.close("promise",{callback:function(){i._addItems.call(d,b,c)}}):i._addItems.call(d,b,c)},_addItems:function(b,c){var d,e,f,g,h=a.data(this,"cubeportfolio");a.isFunction(c)&&h._registerEvent("appendItemsFinish",c,!0),h.$obj.addClass("cbp-no-transition cbp-appendItems-loading"),b=a(b).css("opacity",0),b.filter(".cbp-item").wrapInner('<div class="cbp-item-wrapper"></div>'),g=b.filter(h.defaultFilter),h.ulHidden?"first"===h.ulHidden?(b.appendTo(h.$ulClone),h.blocksClone=h.$ulClone.children(),e=h.blocksClone,f=b.clone(),f.appendTo(h.$ul),h.blocks=h.$ul.children()):(b.appendTo(h.$ul),h.blocks=h.$ul.children(),e=h.blocks,f=b.clone(),f.appendTo(h.$ulClone),h.blocksClone=h.$ulClone.children()):(b.appendTo(h.$ul),h.blocks=h.$ul.children(),e=h.blocks),h.options.caption&&(h._captionDestroy(),h._captionInit()),d=h.defaultFilter,h.blocksAvailable=e.filter(d),e.not(".cbp-item-hidden").not(d).addClass("cbp-item-hidden"),"responsive"===h.options.gridAdjustment&&h._responsiveLayout(),h._layout(),h._processStyle(h.transitionByFilter),h._resizeMainContainer("animate");var j=b.filter(".cbp-item-hidden");switch(h.options.animationType){case"flipOut":j.find(".cbp-item-wrapper").addClass("cbp-animation-flipOut-out");break;case"scaleSides":j.find(".cbp-item-wrapper").addClass("cbp-animation-scaleSides-out");break;case"flipBottom":j.find(".cbp-item-wrapper").addClass("cbp-animation-flipBottom-out")}g.animate({opacity:1},800,function(){switch(h.options.animationType){case"bounceLeft":case"bounceTop":case"bounceBottom":h.blocks.css("opacity",1),h.blocksClone.css("opacity",1);break;case"flipOut":case"scaleSides":case"flipBottom":j.css("opacity",1)}}),h.elems&&i.showCounter.call(this,h.elems),setTimeout(function(){h._triggerEvent("appendItemsFinish")},900)},_initSlider:function(){var a=this,b=Object.create(h);b._init(null,a)}};a.fn.cubeportfolio=function(a){var b=arguments;return this.each(function(){if(i[a])return i[a].apply(this,Array.prototype.slice.call(b,1));if("object"!=typeof a&&a)throw new Error("Method "+a+" does not exist on jQuery.cubeportfolio.js");return i.init.apply(this,b)})},a.fn.cubeportfolio.options={defaultFilter:"*",filterDeeplinking:!1,animationType:"fadeOut",gridAdjustment:"default",gapHorizontal:10,gapVertical:10,caption:"pushTop",displayType:"default",displayTypeSpeed:400,lightboxDelegate:".cbp-lightbox",lightboxGallery:!0,lightboxTitleSrc:"data-title",lightboxCounter:'<div class="cbp-popup-lightbox-counter">{{current}} of {{total}}</div>',singlePageDelegate:".cbp-singlePage",singlePageDeeplinking:!0,singlePageStickyNavigation:!0,singlePageCounter:'<div class="cbp-popup-singlePage-counter">{{current}} of {{total}}</div>',singlePageAnimation:"left",singlePageCallback:function(){},singlePageInlineDelegate:".cbp-singlePageInline",singlePageInlinePosition:"top",singlePageInlineInFocus:!0,singlePageInlineCallback:function(){}}}(jQuery,window,document);;
/*!
 * fancyBox - jQuery Plugin
 * version: 2.1.5 (Fri, 14 Jun 2013)
 * @requires jQuery v1.6 or later
 *
 * Examples at http://fancyapps.com/fancybox/
 * License: www.fancyapps.com/fancybox/#license
 *
 * Copyright 2012 Janis Skarnelis - janis@fancyapps.com
 *
 */

(function (window, document, $, undefined) {
	"use strict";

	var H = $("html"),
		W = $(window),
		D = $(document),
		F = $.fancybox = function () {
			F.open.apply( this, arguments );
		},
		IE =  navigator.userAgent.match(/msie/i),
		didUpdate	= null,
		isTouch		= document.createTouch !== undefined,

		isQuery	= function(obj) {
			return obj && obj.hasOwnProperty && obj instanceof $;
		},
		isString = function(str) {
			return str && $.type(str) === "string";
		},
		isPercentage = function(str) {
			return isString(str) && str.indexOf('%') > 0;
		},
		isScrollable = function(el) {
			return (el && !(el.style.overflow && el.style.overflow === 'hidden') && ((el.clientWidth && el.scrollWidth > el.clientWidth) || (el.clientHeight && el.scrollHeight > el.clientHeight)));
		},
		getScalar = function(orig, dim) {
			var value = parseInt(orig, 10) || 0;

			if (dim && isPercentage(orig)) {
				value = F.getViewport()[ dim ] / 100 * value;
			}

			return Math.ceil(value);
		},
		getValue = function(value, dim) {
			return getScalar(value, dim) + 'px';
		};

	$.extend(F, {
		// The current version of fancyBox
		version: '2.1.5',

		defaults: {
			padding : 15,
			margin  : 20,

			width     : 800,
			height    : 600,
			minWidth  : 100,
			minHeight : 100,
			maxWidth  : 9999,
			maxHeight : 9999,
			pixelRatio: 1, // Set to 2 for retina display support

			autoSize   : true,
			autoHeight : false,
			autoWidth  : false,

			autoResize  : true,
			autoCenter  : !isTouch,
			fitToView   : true,
			aspectRatio : false,
			topRatio    : 0.5,
			leftRatio   : 0.5,

			scrolling : 'auto', // 'auto', 'yes' or 'no'
			wrapCSS   : '',

			arrows     : true,
			closeBtn   : true,
			closeClick : false,
			nextClick  : false,
			mouseWheel : true,
			autoPlay   : false,
			playSpeed  : 3000,
			preload    : 3,
			modal      : false,
			loop       : true,

			ajax  : {
				dataType : 'html',
				headers  : { 'X-fancyBox': true }
			},
			iframe : {
				scrolling : 'auto',
				preload   : true
			},
			swf : {
				wmode: 'transparent',
				allowfullscreen   : 'true',
				allowscriptaccess : 'always'
			},

			keys  : {
				next : {
					13 : 'left', // enter
					34 : 'up',   // page down
					39 : 'left', // right arrow
					40 : 'up'    // down arrow
				},
				prev : {
					8  : 'right',  // backspace
					33 : 'down',   // page up
					37 : 'right',  // left arrow
					38 : 'down'    // up arrow
				},
				close  : [27], // escape key
				play   : [32], // space - start/stop slideshow
				toggle : [70]  // letter "f" - toggle fullscreen
			},

			direction : {
				next : 'left',
				prev : 'right'
			},

			scrollOutside  : true,

			// Override some properties
			index   : 0,
			type    : null,
			href    : null,
			content : null,
			title   : null,

			// HTML templates
			tpl: {
				wrap     : '<div class="fancybox-wrap" tabIndex="-1"><div class="fancybox-skin"><div class="fancybox-outer"><div class="fancybox-inner"></div></div></div></div>',
				image    : '<img class="fancybox-image" src="{href}" alt="" />',
				iframe   : '<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen' + (IE ? ' allowtransparency="true"' : '') + '></iframe>',
				error    : '<p class="fancybox-error">The requested content cannot be loaded.<br/>Please try again later.</p>',
				closeBtn : '<a title="Close" class="fancybox-item fancybox-close" href="javascript:;"></a>',
				next     : '<a title="Next" class="fancybox-nav fancybox-next" href="javascript:;"><span></span></a>',
				prev     : '<a title="Previous" class="fancybox-nav fancybox-prev" href="javascript:;"><span></span></a>'
			},

			// Properties for each animation type
			// Opening fancyBox
			openEffect  : 'fade', // 'elastic', 'fade' or 'none'
			openSpeed   : 250,
			openEasing  : 'swing',
			openOpacity : true,
			openMethod  : 'zoomIn',

			// Closing fancyBox
			closeEffect  : 'fade', // 'elastic', 'fade' or 'none'
			closeSpeed   : 250,
			closeEasing  : 'swing',
			closeOpacity : true,
			closeMethod  : 'zoomOut',

			// Changing next gallery item
			nextEffect : 'elastic', // 'elastic', 'fade' or 'none'
			nextSpeed  : 250,
			nextEasing : 'swing',
			nextMethod : 'changeIn',

			// Changing previous gallery item
			prevEffect : 'elastic', // 'elastic', 'fade' or 'none'
			prevSpeed  : 250,
			prevEasing : 'swing',
			prevMethod : 'changeOut',

			// Enable default helpers
			helpers : {
				overlay : true,
				title   : true
			},

			// Callbacks
			onCancel     : $.noop, // If canceling
			beforeLoad   : $.noop, // Before loading
			afterLoad    : $.noop, // After loading
			beforeShow   : $.noop, // Before changing in current item
			afterShow    : $.noop, // After opening
			beforeChange : $.noop, // Before changing gallery item
			beforeClose  : $.noop, // Before closing
			afterClose   : $.noop  // After closing
		},

		//Current state
		group    : {}, // Selected group
		opts     : {}, // Group options
		previous : null,  // Previous element
		coming   : null,  // Element being loaded
		current  : null,  // Currently loaded element
		isActive : false, // Is activated
		isOpen   : false, // Is currently open
		isOpened : false, // Have been fully opened at least once

		wrap  : null,
		skin  : null,
		outer : null,
		inner : null,

		player : {
			timer    : null,
			isActive : false
		},

		// Loaders
		ajaxLoad   : null,
		imgPreload : null,

		// Some collections
		transitions : {},
		helpers     : {},

		/*
		 *	Static methods
		 */

		open: function (group, opts) {
			if (!group) {
				return;
			}

			if (!$.isPlainObject(opts)) {
				opts = {};
			}

			// Close if already active
			if (false === F.close(true)) {
				return;
			}

			// Normalize group
			if (!$.isArray(group)) {
				group = isQuery(group) ? $(group).get() : [group];
			}

			// Recheck if the type of each element is `object` and set content type (image, ajax, etc)
			$.each(group, function(i, element) {
				var obj = {},
					href,
					title,
					content,
					type,
					rez,
					hrefParts,
					selector;

				if ($.type(element) === "object") {
					// Check if is DOM element
					if (element.nodeType) {
						element = $(element);
					}

					if (isQuery(element)) {
						obj = {
							href    : element.data('fancybox-href') || element.attr('href'),
							title   : element.data('fancybox-title') || element.attr('title'),
							isDom   : true,
							element : element
						};

						if ($.metadata) {
							$.extend(true, obj, element.metadata());
						}

					} else {
						obj = element;
					}
				}

				href  = opts.href  || obj.href || (isString(element) ? element : null);
				title = opts.title !== undefined ? opts.title : obj.title || '';

				content = opts.content || obj.content;
				type    = content ? 'html' : (opts.type  || obj.type);

				if (!type && obj.isDom) {
					type = element.data('fancybox-type');

					if (!type) {
						rez  = element.prop('class').match(/fancybox\.(\w+)/);
						type = rez ? rez[1] : null;
					}
				}

				if (isString(href)) {
					// Try to guess the content type
					if (!type) {
						if (F.isImage(href)) {
							type = 'image';

						} else if (F.isSWF(href)) {
							type = 'swf';

						} else if (href.charAt(0) === '#') {
							type = 'inline';

						} else if (isString(element)) {
							type    = 'html';
							content = element;
						}
					}

					// Split url into two pieces with source url and content selector, e.g,
					// "/mypage.html #my_id" will load "/mypage.html" and display element having id "my_id"
					if (type === 'ajax') {
						hrefParts = href.split(/\s+/, 2);
						href      = hrefParts.shift();
						selector  = hrefParts.shift();
					}
				}

				if (!content) {
					if (type === 'inline') {
						if (href) {
							content = $( isString(href) ? href.replace(/.*(?=#[^\s]+$)/, '') : href ); //strip for ie7

						} else if (obj.isDom) {
							content = element;
						}

					} else if (type === 'html') {
						content = href;

					} else if (!type && !href && obj.isDom) {
						type    = 'inline';
						content = element;
					}
				}

				$.extend(obj, {
					href     : href,
					type     : type,
					content  : content,
					title    : title,
					selector : selector
				});

				group[ i ] = obj;
			});

			// Extend the defaults
			F.opts = $.extend(true, {}, F.defaults, opts);

			// All options are merged recursive except keys
			if (opts.keys !== undefined) {
				F.opts.keys = opts.keys ? $.extend({}, F.defaults.keys, opts.keys) : false;
			}

			F.group = group;

			return F._start(F.opts.index);
		},

		// Cancel image loading or abort ajax request
		cancel: function () {
			var coming = F.coming;

			if (!coming || false === F.trigger('onCancel')) {
				return;
			}

			F.hideLoading();

			if (F.ajaxLoad) {
				F.ajaxLoad.abort();
			}

			F.ajaxLoad = null;

			if (F.imgPreload) {
				F.imgPreload.onload = F.imgPreload.onerror = null;
			}

			if (coming.wrap) {
				coming.wrap.stop(true, true).trigger('onReset').remove();
			}

			F.coming = null;

			// If the first item has been canceled, then clear everything
			if (!F.current) {
				F._afterZoomOut( coming );
			}
		},

		// Start closing animation if is open; remove immediately if opening/closing
		close: function (event) {
			F.cancel();

			if (false === F.trigger('beforeClose')) {
				return;
			}

			F.unbindEvents();

			if (!F.isActive) {
				return;
			}

			if (!F.isOpen || event === true) {
				$('.fancybox-wrap').stop(true).trigger('onReset').remove();

				F._afterZoomOut();

			} else {
				F.isOpen = F.isOpened = false;
				F.isClosing = true;

				$('.fancybox-item, .fancybox-nav').remove();

				F.wrap.stop(true, true).removeClass('fancybox-opened');

				F.transitions[ F.current.closeMethod ]();
			}
		},

		// Manage slideshow:
		//   $.fancybox.play(); - toggle slideshow
		//   $.fancybox.play( true ); - start
		//   $.fancybox.play( false ); - stop
		play: function ( action ) {
			var clear = function () {
					clearTimeout(F.player.timer);
				},
				set = function () {
					clear();

					if (F.current && F.player.isActive) {
						F.player.timer = setTimeout(F.next, F.current.playSpeed);
					}
				},
				stop = function () {
					clear();

					D.unbind('.player');

					F.player.isActive = false;

					F.trigger('onPlayEnd');
				},
				start = function () {
					if (F.current && (F.current.loop || F.current.index < F.group.length - 1)) {
						F.player.isActive = true;

						D.bind({
							'onCancel.player beforeClose.player' : stop,
							'onUpdate.player'   : set,
							'beforeLoad.player' : clear
						});

						set();

						F.trigger('onPlayStart');
					}
				};

			if (action === true || (!F.player.isActive && action !== false)) {
				start();
			} else {
				stop();
			}
		},

		// Navigate to next gallery item
		next: function ( direction ) {
			var current = F.current;

			if (current) {
				if (!isString(direction)) {
					direction = current.direction.next;
				}

				F.jumpto(current.index + 1, direction, 'next');
			}
		},

		// Navigate to previous gallery item
		prev: function ( direction ) {
			var current = F.current;

			if (current) {
				if (!isString(direction)) {
					direction = current.direction.prev;
				}

				F.jumpto(current.index - 1, direction, 'prev');
			}
		},

		// Navigate to gallery item by index
		jumpto: function ( index, direction, router ) {
			var current = F.current;

			if (!current) {
				return;
			}

			index = getScalar(index);

			F.direction = direction || current.direction[ (index >= current.index ? 'next' : 'prev') ];
			F.router    = router || 'jumpto';

			if (current.loop) {
				if (index < 0) {
					index = current.group.length + (index % current.group.length);
				}

				index = index % current.group.length;
			}

			if (current.group[ index ] !== undefined) {
				F.cancel();

				F._start(index);
			}
		},

		// Center inside viewport and toggle position type to fixed or absolute if needed
		reposition: function (e, onlyAbsolute) {
			var current = F.current,
				wrap    = current ? current.wrap : null,
				pos;

			if (wrap) {
				pos = F._getPosition(onlyAbsolute);

				if (e && e.type === 'scroll') {
					delete pos.position;

					wrap.stop(true, true).animate(pos, 200);

				} else {
					wrap.css(pos);

					current.pos = $.extend({}, current.dim, pos);
				}
			}
		},

		update: function (e) {
			var type = (e && e.type),
				anyway = !type || type === 'orientationchange';

			if (anyway) {
				clearTimeout(didUpdate);

				didUpdate = null;
			}

			if (!F.isOpen || didUpdate) {
				return;
			}

			didUpdate = setTimeout(function() {
				var current = F.current;

				if (!current || F.isClosing) {
					return;
				}

				F.wrap.removeClass('fancybox-tmp');

				if (anyway || type === 'load' || (type === 'resize' && current.autoResize)) {
					F._setDimension();
				}

				if (!(type === 'scroll' && current.canShrink)) {
					F.reposition(e);
				}

				F.trigger('onUpdate');

				didUpdate = null;

			}, (anyway && !isTouch ? 0 : 300));
		},

		// Shrink content to fit inside viewport or restore if resized
		toggle: function ( action ) {
			if (F.isOpen) {
				F.current.fitToView = $.type(action) === "boolean" ? action : !F.current.fitToView;

				// Help browser to restore document dimensions
				if (isTouch) {
					F.wrap.removeAttr('style').addClass('fancybox-tmp');

					F.trigger('onUpdate');
				}

				F.update();
			}
		},

		hideLoading: function () {
			D.unbind('.loading');

			$('#fancybox-loading').remove();
		},

		showLoading: function () {
			var el, viewport;

			F.hideLoading();

			el = $('<div id="fancybox-loading"><div></div></div>').click(F.cancel).appendTo('body');

			// If user will press the escape-button, the request will be canceled
			D.bind('keydown.loading', function(e) {
				if ((e.which || e.keyCode) === 27) {
					e.preventDefault();

					F.cancel();
				}
			});

			if (!F.defaults.fixed) {
				viewport = F.getViewport();

				el.css({
					position : 'absolute',
					top  : (viewport.h * 0.5) + viewport.y,
					left : (viewport.w * 0.5) + viewport.x
				});
			}
		},

		getViewport: function () {
			var locked = (F.current && F.current.locked) || false,
				rez    = {
					x: W.scrollLeft(),
					y: W.scrollTop()
				};

			if (locked) {
				rez.w = locked[0].clientWidth;
				rez.h = locked[0].clientHeight;

			} else {
				// See http://bugs.jquery.com/ticket/6724
				rez.w = isTouch && window.innerWidth  ? window.innerWidth  : W.width();
				rez.h = isTouch && window.innerHeight ? window.innerHeight : W.height();
			}

			return rez;
		},

		// Unbind the keyboard / clicking actions
		unbindEvents: function () {
			if (F.wrap && isQuery(F.wrap)) {
				F.wrap.unbind('.fb');
			}

			D.unbind('.fb');
			W.unbind('.fb');
		},

		bindEvents: function () {
			var current = F.current,
				keys;

			if (!current) {
				return;
			}

			// Changing document height on iOS devices triggers a 'resize' event,
			// that can change document height... repeating infinitely
			W.bind('orientationchange.fb' + (isTouch ? '' : ' resize.fb') + (current.autoCenter && !current.locked ? ' scroll.fb' : ''), F.update);

			keys = current.keys;

			if (keys) {
				D.bind('keydown.fb', function (e) {
					var code   = e.which || e.keyCode,
						target = e.target || e.srcElement;

					// Skip esc key if loading, because showLoading will cancel preloading
					if (code === 27 && F.coming) {
						return false;
					}

					// Ignore key combinations and key events within form elements
					if (!e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey && !(target && (target.type || $(target).is('[contenteditable]')))) {
						$.each(keys, function(i, val) {
							if (current.group.length > 1 && val[ code ] !== undefined) {
								F[ i ]( val[ code ] );

								e.preventDefault();
								return false;
							}

							if ($.inArray(code, val) > -1) {
								F[ i ] ();

								e.preventDefault();
								return false;
							}
						});
					}
				});
			}

			if ($.fn.mousewheel && current.mouseWheel) {
				F.wrap.bind('mousewheel.fb', function (e, delta, deltaX, deltaY) {
					var target = e.target || null,
						parent = $(target),
						canScroll = false;

					while (parent.length) {
						if (canScroll || parent.is('.fancybox-skin') || parent.is('.fancybox-wrap')) {
							break;
						}

						canScroll = isScrollable( parent[0] );
						parent    = $(parent).parent();
					}

					if (delta !== 0 && !canScroll) {
						if (F.group.length > 1 && !current.canShrink) {
							if (deltaY > 0 || deltaX > 0) {
								F.prev( deltaY > 0 ? 'down' : 'left' );

							} else if (deltaY < 0 || deltaX < 0) {
								F.next( deltaY < 0 ? 'up' : 'right' );
							}

							e.preventDefault();
						}
					}
				});
			}
		},

		trigger: function (event, o) {
			var ret, obj = o || F.coming || F.current;

			if (!obj) {
				return;
			}

			if ($.isFunction( obj[event] )) {
				ret = obj[event].apply(obj, Array.prototype.slice.call(arguments, 1));
			}

			if (ret === false) {
				return false;
			}

			if (obj.helpers) {
				$.each(obj.helpers, function (helper, opts) {
					if (opts && F.helpers[helper] && $.isFunction(F.helpers[helper][event])) {
						F.helpers[helper][event]($.extend(true, {}, F.helpers[helper].defaults, opts), obj);
					}
				});
			}

			D.trigger(event);
		},

		isImage: function (str) {
			return isString(str) && str.match(/(^data:image\/.*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg)((\?|#).*)?$)/i);
		},

		isSWF: function (str) {
			return isString(str) && str.match(/\.(swf)((\?|#).*)?$/i);
		},

		_start: function (index) {
			var coming = {},
				obj,
				href,
				type,
				margin,
				padding;

			index = getScalar( index );
			obj   = F.group[ index ] || null;

			if (!obj) {
				return false;
			}

			coming = $.extend(true, {}, F.opts, obj);

			// Convert margin and padding properties to array - top, right, bottom, left
			margin  = coming.margin;
			padding = coming.padding;

			if ($.type(margin) === 'number') {
				coming.margin = [margin, margin, margin, margin];
			}

			if ($.type(padding) === 'number') {
				coming.padding = [padding, padding, padding, padding];
			}

			// 'modal' propery is just a shortcut
			if (coming.modal) {
				$.extend(true, coming, {
					closeBtn   : false,
					closeClick : false,
					nextClick  : false,
					arrows     : false,
					mouseWheel : false,
					keys       : null,
					helpers: {
						overlay : {
							closeClick : false
						}
					}
				});
			}

			// 'autoSize' property is a shortcut, too
			if (coming.autoSize) {
				coming.autoWidth = coming.autoHeight = true;
			}

			if (coming.width === 'auto') {
				coming.autoWidth = true;
			}

			if (coming.height === 'auto') {
				coming.autoHeight = true;
			}

			/*
			 * Add reference to the group, so it`s possible to access from callbacks, example:
			 * afterLoad : function() {
			 *     this.title = 'Image ' + (this.index + 1) + ' of ' + this.group.length + (this.title ? ' - ' + this.title : '');
			 * }
			 */

			coming.group  = F.group;
			coming.index  = index;

			// Give a chance for callback or helpers to update coming item (type, title, etc)
			F.coming = coming;

			if (false === F.trigger('beforeLoad')) {
				F.coming = null;

				return;
			}

			type = coming.type;
			href = coming.href;

			if (!type) {
				F.coming = null;

				//If we can not determine content type then drop silently or display next/prev item if looping through gallery
				if (F.current && F.router && F.router !== 'jumpto') {
					F.current.index = index;

					return F[ F.router ]( F.direction );
				}

				return false;
			}

			F.isActive = true;

			if (type === 'image' || type === 'swf') {
				coming.autoHeight = coming.autoWidth = false;
				coming.scrolling  = 'visible';
			}

			if (type === 'image') {
				coming.aspectRatio = true;
			}

			if (type === 'iframe' && isTouch) {
				coming.scrolling = 'scroll';
			}

			// Build the neccessary markup
			coming.wrap = $(coming.tpl.wrap).addClass('fancybox-' + (isTouch ? 'mobile' : 'desktop') + ' fancybox-type-' + type + ' fancybox-tmp ' + coming.wrapCSS).appendTo( coming.parent || 'body' );

			$.extend(coming, {
				skin  : $('.fancybox-skin',  coming.wrap),
				outer : $('.fancybox-outer', coming.wrap),
				inner : $('.fancybox-inner', coming.wrap)
			});

			$.each(["Top", "Right", "Bottom", "Left"], function(i, v) {
				coming.skin.css('padding' + v, getValue(coming.padding[ i ]));
			});

			F.trigger('onReady');

			// Check before try to load; 'inline' and 'html' types need content, others - href
			if (type === 'inline' || type === 'html') {
				if (!coming.content || !coming.content.length) {
					return F._error( 'content' );
				}

			} else if (!href) {
				return F._error( 'href' );
			}

			if (type === 'image') {
				F._loadImage();

			} else if (type === 'ajax') {
				F._loadAjax();

			} else if (type === 'iframe') {
				F._loadIframe();

			} else {
				F._afterLoad();
			}
		},

		_error: function ( type ) {
			$.extend(F.coming, {
				type       : 'html',
				autoWidth  : true,
				autoHeight : true,
				minWidth   : 0,
				minHeight  : 0,
				scrolling  : 'no',
				hasError   : type,
				content    : F.coming.tpl.error
			});

			F._afterLoad();
		},

		_loadImage: function () {
			// Reset preload image so it is later possible to check "complete" property
			var img = F.imgPreload = new Image();

			img.onload = function () {
				this.onload = this.onerror = null;

				F.coming.width  = this.width / F.opts.pixelRatio;
				F.coming.height = this.height / F.opts.pixelRatio;

				F._afterLoad();
			};

			img.onerror = function () {
				this.onload = this.onerror = null;

				F._error( 'image' );
			};

			img.src = F.coming.href;

			if (img.complete !== true) {
				F.showLoading();
			}
		},

		_loadAjax: function () {
			var coming = F.coming;

			F.showLoading();

			F.ajaxLoad = $.ajax($.extend({}, coming.ajax, {
				url: coming.href,
				error: function (jqXHR, textStatus) {
					if (F.coming && textStatus !== 'abort') {
						F._error( 'ajax', jqXHR );

					} else {
						F.hideLoading();
					}
				},
				success: function (data, textStatus) {
					if (textStatus === 'success') {
						coming.content = data;

						F._afterLoad();
					}
				}
			}));
		},

		_loadIframe: function() {
			var coming = F.coming,
				iframe = $(coming.tpl.iframe.replace(/\{rnd\}/g, new Date().getTime()))
					.attr('scrolling', isTouch ? 'auto' : coming.iframe.scrolling)
					.attr('src', coming.href);

			// This helps IE
			$(coming.wrap).bind('onReset', function () {
				try {
					$(this).find('iframe').hide().attr('src', '//about:blank').end().empty();
				} catch (e) {}
			});

			if (coming.iframe.preload) {
				F.showLoading();

				iframe.one('load', function() {
					$(this).data('ready', 1);

					// iOS will lose scrolling if we resize
					if (!isTouch) {
						$(this).bind('load.fb', F.update);
					}

					// Without this trick:
					//   - iframe won't scroll on iOS devices
					//   - IE7 sometimes displays empty iframe
					$(this).parents('.fancybox-wrap').width('100%').removeClass('fancybox-tmp').show();

					F._afterLoad();
				});
			}

			coming.content = iframe.appendTo( coming.inner );

			if (!coming.iframe.preload) {
				F._afterLoad();
			}
		},

		_preloadImages: function() {
			var group   = F.group,
				current = F.current,
				len     = group.length,
				cnt     = current.preload ? Math.min(current.preload, len - 1) : 0,
				item,
				i;

			for (i = 1; i <= cnt; i += 1) {
				item = group[ (current.index + i ) % len ];

				if (item.type === 'image' && item.href) {
					new Image().src = item.href;
				}
			}
		},

		_afterLoad: function () {
			var coming   = F.coming,
				previous = F.current,
				placeholder = 'fancybox-placeholder',
				current,
				content,
				type,
				scrolling,
				href,
				embed;

			F.hideLoading();

			if (!coming || F.isActive === false) {
				return;
			}

			if (false === F.trigger('afterLoad', coming, previous)) {
				coming.wrap.stop(true).trigger('onReset').remove();

				F.coming = null;

				return;
			}

			if (previous) {
				F.trigger('beforeChange', previous);

				previous.wrap.stop(true).removeClass('fancybox-opened')
					.find('.fancybox-item, .fancybox-nav')
					.remove();
			}

			F.unbindEvents();

			current   = coming;
			content   = coming.content;
			type      = coming.type;
			scrolling = coming.scrolling;

			$.extend(F, {
				wrap  : current.wrap,
				skin  : current.skin,
				outer : current.outer,
				inner : current.inner,
				current  : current,
				previous : previous
			});

			href = current.href;

			switch (type) {
				case 'inline':
				case 'ajax':
				case 'html':
					if (current.selector) {
						content = $('<div>').html(content).find(current.selector);

					} else if (isQuery(content)) {
						if (!content.data(placeholder)) {
							content.data(placeholder, $('<div class="' + placeholder + '"></div>').insertAfter( content ).hide() );
						}

						content = content.show().detach();

						current.wrap.bind('onReset', function () {
							if ($(this).find(content).length) {
								content.hide().replaceAll( content.data(placeholder) ).data(placeholder, false);
							}
						});
					}
				break;

				case 'image':
					content = current.tpl.image.replace('{href}', href);
				break;

				case 'swf':
					content = '<object id="fancybox-swf" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="100%" height="100%"><param name="movie" value="' + href + '"></param>';
					embed   = '';

					$.each(current.swf, function(name, val) {
						content += '<param name="' + name + '" value="' + val + '"></param>';
						embed   += ' ' + name + '="' + val + '"';
					});

					content += '<embed src="' + href + '" type="application/x-shockwave-flash" width="100%" height="100%"' + embed + '></embed></object>';
				break;
			}

			if (!(isQuery(content) && content.parent().is(current.inner))) {
				current.inner.append( content );
			}

			// Give a chance for helpers or callbacks to update elements
			F.trigger('beforeShow');

			// Set scrolling before calculating dimensions
			current.inner.css('overflow', scrolling === 'yes' ? 'scroll' : (scrolling === 'no' ? 'hidden' : scrolling));

			// Set initial dimensions and start position
			F._setDimension();

			F.reposition();

			F.isOpen = false;
			F.coming = null;

			F.bindEvents();

			if (!F.isOpened) {
				$('.fancybox-wrap').not( current.wrap ).stop(true).trigger('onReset').remove();

			} else if (previous.prevMethod) {
				F.transitions[ previous.prevMethod ]();
			}

			F.transitions[ F.isOpened ? current.nextMethod : current.openMethod ]();

			F._preloadImages();
		},

		_setDimension: function () {
			var viewport   = F.getViewport(),
				steps      = 0,
				canShrink  = false,
				canExpand  = false,
				wrap       = F.wrap,
				skin       = F.skin,
				inner      = F.inner,
				current    = F.current,
				width      = current.width,
				height     = current.height,
				minWidth   = current.minWidth,
				minHeight  = current.minHeight,
				maxWidth   = current.maxWidth,
				maxHeight  = current.maxHeight,
				scrolling  = current.scrolling,
				scrollOut  = current.scrollOutside ? current.scrollbarWidth : 0,
				margin     = current.margin,
				wMargin    = getScalar(margin[1] + margin[3]),
				hMargin    = getScalar(margin[0] + margin[2]),
				wPadding,
				hPadding,
				wSpace,
				hSpace,
				origWidth,
				origHeight,
				origMaxWidth,
				origMaxHeight,
				ratio,
				width_,
				height_,
				maxWidth_,
				maxHeight_,
				iframe,
				body;

			// Reset dimensions so we could re-check actual size
			wrap.add(skin).add(inner).width('auto').height('auto').removeClass('fancybox-tmp');

			wPadding = getScalar(skin.outerWidth(true)  - skin.width());
			hPadding = getScalar(skin.outerHeight(true) - skin.height());

			// Any space between content and viewport (margin, padding, border, title)
			wSpace = wMargin + wPadding;
			hSpace = hMargin + hPadding;

			origWidth  = isPercentage(width)  ? (viewport.w - wSpace) * getScalar(width)  / 100 : width;
			origHeight = isPercentage(height) ? (viewport.h - hSpace) * getScalar(height) / 100 : height;

			if (current.type === 'iframe') {
				iframe = current.content;

				if (current.autoHeight && iframe.data('ready') === 1) {
					try {
						if (iframe[0].contentWindow.document.location) {
							inner.width( origWidth ).height(9999);

							body = iframe.contents().find('body');

							if (scrollOut) {
								body.css('overflow-x', 'hidden');
							}

							origHeight = body.outerHeight(true);
						}

					} catch (e) {}
				}

			} else if (current.autoWidth || current.autoHeight) {
				inner.addClass( 'fancybox-tmp' );

				// Set width or height in case we need to calculate only one dimension
				if (!current.autoWidth) {
					inner.width( origWidth );
				}

				if (!current.autoHeight) {
					inner.height( origHeight );
				}

				if (current.autoWidth) {
					origWidth = inner.width();
				}

				if (current.autoHeight) {
					origHeight = inner.height();
				}

				inner.removeClass( 'fancybox-tmp' );
			}

			width  = getScalar( origWidth );
			height = getScalar( origHeight );

			ratio  = origWidth / origHeight;

			// Calculations for the content
			minWidth  = getScalar(isPercentage(minWidth) ? getScalar(minWidth, 'w') - wSpace : minWidth);
			maxWidth  = getScalar(isPercentage(maxWidth) ? getScalar(maxWidth, 'w') - wSpace : maxWidth);

			minHeight = getScalar(isPercentage(minHeight) ? getScalar(minHeight, 'h') - hSpace : minHeight);
			maxHeight = getScalar(isPercentage(maxHeight) ? getScalar(maxHeight, 'h') - hSpace : maxHeight);

			// These will be used to determine if wrap can fit in the viewport
			origMaxWidth  = maxWidth;
			origMaxHeight = maxHeight;

			if (current.fitToView) {
				maxWidth  = Math.min(viewport.w - wSpace, maxWidth);
				maxHeight = Math.min(viewport.h - hSpace, maxHeight);
			}

			maxWidth_  = viewport.w - wMargin;
			maxHeight_ = viewport.h - hMargin;

			if (current.aspectRatio) {
				if (width > maxWidth) {
					width  = maxWidth;
					height = getScalar(width / ratio);
				}

				if (height > maxHeight) {
					height = maxHeight;
					width  = getScalar(height * ratio);
				}

				if (width < minWidth) {
					width  = minWidth;
					height = getScalar(width / ratio);
				}

				if (height < minHeight) {
					height = minHeight;
					width  = getScalar(height * ratio);
				}

			} else {
				width = Math.max(minWidth, Math.min(width, maxWidth));

				if (current.autoHeight && current.type !== 'iframe') {
					inner.width( width );

					height = inner.height();
				}

				height = Math.max(minHeight, Math.min(height, maxHeight));
			}

			// Try to fit inside viewport (including the title)
			if (current.fitToView) {
				inner.width( width ).height( height );

				wrap.width( width + wPadding );

				// Real wrap dimensions
				width_  = wrap.width();
				height_ = wrap.height();

				if (current.aspectRatio) {
					while ((width_ > maxWidth_ || height_ > maxHeight_) && width > minWidth && height > minHeight) {
						if (steps++ > 19) {
							break;
						}

						height = Math.max(minHeight, Math.min(maxHeight, height - 10));
						width  = getScalar(height * ratio);

						if (width < minWidth) {
							width  = minWidth;
							height = getScalar(width / ratio);
						}

						if (width > maxWidth) {
							width  = maxWidth;
							height = getScalar(width / ratio);
						}

						inner.width( width ).height( height );

						wrap.width( width + wPadding );

						width_  = wrap.width();
						height_ = wrap.height();
					}

				} else {
					width  = Math.max(minWidth,  Math.min(width,  width  - (width_  - maxWidth_)));
					height = Math.max(minHeight, Math.min(height, height - (height_ - maxHeight_)));
				}
			}

			if (scrollOut && scrolling === 'auto' && height < origHeight && (width + wPadding + scrollOut) < maxWidth_) {
				width += scrollOut;
			}

			inner.width( width ).height( height );

			wrap.width( width + wPadding );

			width_  = wrap.width();
			height_ = wrap.height();

			canShrink = (width_ > maxWidth_ || height_ > maxHeight_) && width > minWidth && height > minHeight;
			canExpand = current.aspectRatio ? (width < origMaxWidth && height < origMaxHeight && width < origWidth && height < origHeight) : ((width < origMaxWidth || height < origMaxHeight) && (width < origWidth || height < origHeight));

			$.extend(current, {
				dim : {
					width	: getValue( width_ ),
					height	: getValue( height_ )
				},
				origWidth  : origWidth,
				origHeight : origHeight,
				canShrink  : canShrink,
				canExpand  : canExpand,
				wPadding   : wPadding,
				hPadding   : hPadding,
				wrapSpace  : height_ - skin.outerHeight(true),
				skinSpace  : skin.height() - height
			});

			if (!iframe && current.autoHeight && height > minHeight && height < maxHeight && !canExpand) {
				inner.height('auto');
			}
		},

		_getPosition: function (onlyAbsolute) {
			var current  = F.current,
				viewport = F.getViewport(),
				margin   = current.margin,
				width    = F.wrap.width()  + margin[1] + margin[3],
				height   = F.wrap.height() + margin[0] + margin[2],
				rez      = {
					position: 'absolute',
					top  : margin[0],
					left : margin[3]
				};

			if (current.autoCenter && current.fixed && !onlyAbsolute && height <= viewport.h && width <= viewport.w) {
				rez.position = 'fixed';

			} else if (!current.locked) {
				rez.top  += viewport.y;
				rez.left += viewport.x;
			}

			rez.top  = getValue(Math.max(rez.top,  rez.top  + ((viewport.h - height) * current.topRatio)));
			rez.left = getValue(Math.max(rez.left, rez.left + ((viewport.w - width)  * current.leftRatio)));

			return rez;
		},

		_afterZoomIn: function () {
			var current = F.current;

			if (!current) {
				return;
			}

			F.isOpen = F.isOpened = true;

			F.wrap.css('overflow', 'visible').addClass('fancybox-opened');

			F.update();

			// Assign a click event
			if ( current.closeClick || (current.nextClick && F.group.length > 1) ) {
				F.inner.css('cursor', 'pointer').bind('click.fb', function(e) {
					if (!$(e.target).is('a') && !$(e.target).parent().is('a')) {
						e.preventDefault();

						F[ current.closeClick ? 'close' : 'next' ]();
					}
				});
			}

			// Create a close button
			if (current.closeBtn) {
				$(current.tpl.closeBtn).appendTo(F.skin).bind('click.fb', function(e) {
					e.preventDefault();

					F.close();
				});
			}

			// Create navigation arrows
			if (current.arrows && F.group.length > 1) {
				if (current.loop || current.index > 0) {
					$(current.tpl.prev).appendTo(F.outer).bind('click.fb', F.prev);
				}

				if (current.loop || current.index < F.group.length - 1) {
					$(current.tpl.next).appendTo(F.outer).bind('click.fb', F.next);
				}
			}

			F.trigger('afterShow');

			// Stop the slideshow if this is the last item
			if (!current.loop && current.index === current.group.length - 1) {
				F.play( false );

			} else if (F.opts.autoPlay && !F.player.isActive) {
				F.opts.autoPlay = false;

				F.play();
			}
		},

		_afterZoomOut: function ( obj ) {
			obj = obj || F.current;

			$('.fancybox-wrap').trigger('onReset').remove();

			$.extend(F, {
				group  : {},
				opts   : {},
				router : false,
				current   : null,
				isActive  : false,
				isOpened  : false,
				isOpen    : false,
				isClosing : false,
				wrap   : null,
				skin   : null,
				outer  : null,
				inner  : null
			});

			F.trigger('afterClose', obj);
		}
	});

	/*
	 *	Default transitions
	 */

	F.transitions = {
		getOrigPosition: function () {
			var current  = F.current,
				element  = current.element,
				orig     = current.orig,
				pos      = {},
				width    = 50,
				height   = 50,
				hPadding = current.hPadding,
				wPadding = current.wPadding,
				viewport = F.getViewport();

			if (!orig && current.isDom && element.is(':visible')) {
				orig = element.find('img:first');

				if (!orig.length) {
					orig = element;
				}
			}

			if (isQuery(orig)) {
				pos = orig.offset();

				if (orig.is('img')) {
					width  = orig.outerWidth();
					height = orig.outerHeight();
				}

			} else {
				pos.top  = viewport.y + (viewport.h - height) * current.topRatio;
				pos.left = viewport.x + (viewport.w - width)  * current.leftRatio;
			}

			if (F.wrap.css('position') === 'fixed' || current.locked) {
				pos.top  -= viewport.y;
				pos.left -= viewport.x;
			}

			pos = {
				top     : getValue(pos.top  - hPadding * current.topRatio),
				left    : getValue(pos.left - wPadding * current.leftRatio),
				width   : getValue(width  + wPadding),
				height  : getValue(height + hPadding)
			};

			return pos;
		},

		step: function (now, fx) {
			var ratio,
				padding,
				value,
				prop       = fx.prop,
				current    = F.current,
				wrapSpace  = current.wrapSpace,
				skinSpace  = current.skinSpace;

			if (prop === 'width' || prop === 'height') {
				ratio = fx.end === fx.start ? 1 : (now - fx.start) / (fx.end - fx.start);

				if (F.isClosing) {
					ratio = 1 - ratio;
				}

				padding = prop === 'width' ? current.wPadding : current.hPadding;
				value   = now - padding;

				F.skin[ prop ](  getScalar( prop === 'width' ?  value : value - (wrapSpace * ratio) ) );
				F.inner[ prop ]( getScalar( prop === 'width' ?  value : value - (wrapSpace * ratio) - (skinSpace * ratio) ) );
			}
		},

		zoomIn: function () {
			var current  = F.current,
				startPos = current.pos,
				effect   = current.openEffect,
				elastic  = effect === 'elastic',
				endPos   = $.extend({opacity : 1}, startPos);

			// Remove "position" property that breaks older IE
			delete endPos.position;

			if (elastic) {
				startPos = this.getOrigPosition();

				if (current.openOpacity) {
					startPos.opacity = 0.1;
				}

			} else if (effect === 'fade') {
				startPos.opacity = 0.1;
			}

			F.wrap.css(startPos).animate(endPos, {
				duration : effect === 'none' ? 0 : current.openSpeed,
				easing   : current.openEasing,
				step     : elastic ? this.step : null,
				complete : F._afterZoomIn
			});
		},

		zoomOut: function () {
			var current  = F.current,
				effect   = current.closeEffect,
				elastic  = effect === 'elastic',
				endPos   = {opacity : 0.1};

			if (elastic) {
				endPos = this.getOrigPosition();

				if (current.closeOpacity) {
					endPos.opacity = 0.1;
				}
			}

			F.wrap.animate(endPos, {
				duration : effect === 'none' ? 0 : current.closeSpeed,
				easing   : current.closeEasing,
				step     : elastic ? this.step : null,
				complete : F._afterZoomOut
			});
		},

		changeIn: function () {
			var current   = F.current,
				effect    = current.nextEffect,
				startPos  = current.pos,
				endPos    = { opacity : 1 },
				direction = F.direction,
				distance  = 200,
				field;

			startPos.opacity = 0.1;

			if (effect === 'elastic') {
				field = direction === 'down' || direction === 'up' ? 'top' : 'left';

				if (direction === 'down' || direction === 'right') {
					startPos[ field ] = getValue(getScalar(startPos[ field ]) - distance);
					endPos[ field ]   = '+=' + distance + 'px';

				} else {
					startPos[ field ] = getValue(getScalar(startPos[ field ]) + distance);
					endPos[ field ]   = '-=' + distance + 'px';
				}
			}

			// Workaround for http://bugs.jquery.com/ticket/12273
			if (effect === 'none') {
				F._afterZoomIn();

			} else {
				F.wrap.css(startPos).animate(endPos, {
					duration : current.nextSpeed,
					easing   : current.nextEasing,
					complete : F._afterZoomIn
				});
			}
		},

		changeOut: function () {
			var previous  = F.previous,
				effect    = previous.prevEffect,
				endPos    = { opacity : 0.1 },
				direction = F.direction,
				distance  = 200;

			if (effect === 'elastic') {
				endPos[ direction === 'down' || direction === 'up' ? 'top' : 'left' ] = ( direction === 'up' || direction === 'left' ? '-' : '+' ) + '=' + distance + 'px';
			}

			previous.wrap.animate(endPos, {
				duration : effect === 'none' ? 0 : previous.prevSpeed,
				easing   : previous.prevEasing,
				complete : function () {
					$(this).trigger('onReset').remove();
				}
			});
		}
	};

	/*
	 *	Overlay helper
	 */

	F.helpers.overlay = {
		defaults : {
			closeClick : true,      // if true, fancyBox will be closed when user clicks on the overlay
			speedOut   : 200,       // duration of fadeOut animation
			showEarly  : true,      // indicates if should be opened immediately or wait until the content is ready
			css        : {},        // custom CSS properties
			locked     : !isTouch,  // if true, the content will be locked into overlay
			fixed      : true       // if false, the overlay CSS position property will not be set to "fixed"
		},

		overlay : null,      // current handle
		fixed   : false,     // indicates if the overlay has position "fixed"
		el      : $('html'), // element that contains "the lock"

		// Public methods
		create : function(opts) {
			opts = $.extend({}, this.defaults, opts);

			if (this.overlay) {
				this.close();
			}

			this.overlay = $('<div class="fancybox-overlay"></div>').appendTo( F.coming ? F.coming.parent : opts.parent );
			this.fixed   = false;

			if (opts.fixed && F.defaults.fixed) {
				this.overlay.addClass('fancybox-overlay-fixed');

				this.fixed = true;
			}
		},

		open : function(opts) {
			var that = this;

			opts = $.extend({}, this.defaults, opts);

			if (this.overlay) {
				this.overlay.unbind('.overlay').width('auto').height('auto');

			} else {
				this.create(opts);
			}

			if (!this.fixed) {
				W.bind('resize.overlay', $.proxy( this.update, this) );

				this.update();
			}

			if (opts.closeClick) {
				this.overlay.bind('click.overlay', function(e) {
					if ($(e.target).hasClass('fancybox-overlay')) {
						if (F.isActive) {
							F.close();
						} else {
							that.close();
						}

						return false;
					}
				});
			}

			this.overlay.css( opts.css ).show();
		},

		close : function() {
			var scrollV, scrollH;

			W.unbind('resize.overlay');

			if (this.el.hasClass('fancybox-lock')) {
				$('.fancybox-margin').removeClass('fancybox-margin');

				scrollV = W.scrollTop();
				scrollH = W.scrollLeft();

				this.el.removeClass('fancybox-lock');

				W.scrollTop( scrollV ).scrollLeft( scrollH );
			}

			$('.fancybox-overlay').remove().hide();

			$.extend(this, {
				overlay : null,
				fixed   : false
			});
		},

		// Private, callbacks

		update : function () {
			var width = '100%', offsetWidth;

			// Reset width/height so it will not mess
			this.overlay.width(width).height('100%');

			// jQuery does not return reliable result for IE
			if (IE) {
				offsetWidth = Math.max(document.documentElement.offsetWidth, document.body.offsetWidth);

				if (D.width() > offsetWidth) {
					width = D.width();
				}

			} else if (D.width() > W.width()) {
				width = D.width();
			}

			this.overlay.width(width).height(D.height());
		},

		// This is where we can manipulate DOM, because later it would cause iframes to reload
		onReady : function (opts, obj) {
			var overlay = this.overlay;

			$('.fancybox-overlay').stop(true, true);

			if (!overlay) {
				this.create(opts);
			}

			if (opts.locked && this.fixed && obj.fixed) {
				if (!overlay) {
					this.margin = D.height() > W.height() ? $('html').css('margin-right').replace("px", "") : false;
				}

				obj.locked = this.overlay.append( obj.wrap );
				obj.fixed  = false;
			}

			if (opts.showEarly === true) {
				this.beforeShow.apply(this, arguments);
			}
		},

		beforeShow : function(opts, obj) {
			var scrollV, scrollH;

			if (obj.locked) {
				if (this.margin !== false) {
					$('*').filter(function(){
						return ($(this).css('position') === 'fixed' && !$(this).hasClass("fancybox-overlay") && !$(this).hasClass("fancybox-wrap") );
					}).addClass('fancybox-margin');

					this.el.addClass('fancybox-margin');
				}

				scrollV = W.scrollTop();
				scrollH = W.scrollLeft();

				this.el.addClass('fancybox-lock');

				W.scrollTop( scrollV ).scrollLeft( scrollH );
			}

			this.open(opts);
		},

		onUpdate : function() {
			if (!this.fixed) {
				this.update();
			}
		},

		afterClose: function (opts) {
			// Remove overlay if exists and fancyBox is not opening
			// (e.g., it is not being open using afterClose callback)
			//if (this.overlay && !F.isActive) {
			if (this.overlay && !F.coming) {
				this.overlay.fadeOut(opts.speedOut, $.proxy( this.close, this ));
			}
		}
	};

	/*
	 *	Title helper
	 */

	F.helpers.title = {
		defaults : {
			type     : 'float', // 'float', 'inside', 'outside' or 'over',
			position : 'bottom' // 'top' or 'bottom'
		},

		beforeShow: function (opts) {
			var current = F.current,
				text    = current.title,
				type    = opts.type,
				title,
				target;

			if ($.isFunction(text)) {
				text = text.call(current.element, current);
			}

			if (!isString(text) || $.trim(text) === '') {
				return;
			}

			title = $('<div class="fancybox-title fancybox-title-' + type + '-wrap">' + text + '</div>');

			switch (type) {
				case 'inside':
					target = F.skin;
				break;

				case 'outside':
					target = F.wrap;
				break;

				case 'over':
					target = F.inner;
				break;

				default: // 'float'
					target = F.skin;

					title.appendTo('body');

					if (IE) {
						title.width( title.width() );
					}

					title.wrapInner('<span class="child"></span>');

					//Increase bottom margin so this title will also fit into viewport
					F.current.margin[2] += Math.abs( getScalar(title.css('margin-bottom')) );
				break;
			}

			title[ (opts.position === 'top' ? 'prependTo'  : 'appendTo') ](target);
		}
	};

	// jQuery plugin initialization
	$.fn.fancybox = function (options) {
		var index,
			that     = $(this),
			selector = this.selector || '',
			run      = function(e) {
				var what = $(this).blur(), idx = index, relType, relVal;

				if (!(e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) && !what.is('.fancybox-wrap')) {
					relType = options.groupAttr || 'data-fancybox-group';
					relVal  = what.attr(relType);

					if (!relVal) {
						relType = 'rel';
						relVal  = what.get(0)[ relType ];
					}

					if (relVal && relVal !== '' && relVal !== 'nofollow') {
						what = selector.length ? $(selector) : that;
						what = what.filter('[' + relType + '="' + relVal + '"]');
						idx  = what.index(this);
					}

					options.index = idx;

					// Stop an event from bubbling if everything is fine
					if (F.open(what, options) !== false) {
						e.preventDefault();
					}
				}
			};

		options = options || {};
		index   = options.index || 0;

		if (!selector || options.live === false) {
			that.unbind('click.fb-start').bind('click.fb-start', run);

		} else {
			D.undelegate(selector, 'click.fb-start').delegate(selector + ":not('.fancybox-item, .fancybox-nav')", 'click.fb-start', run);
		}

		this.filter('[data-fancybox-start=1]').trigger('click');

		return this;
	};

	// Tests that need a body at doc ready
	D.ready(function() {
		var w1, w2;

		if ( $.scrollbarWidth === undefined ) {
			// http://benalman.com/projects/jquery-misc-plugins/#scrollbarwidth
			$.scrollbarWidth = function() {
				var parent = $('<div style="width:50px;height:50px;overflow:auto"><div/></div>').appendTo('body'),
					child  = parent.children(),
					width  = child.innerWidth() - child.height( 99 ).innerWidth();

				parent.remove();

				return width;
			};
		}

		if ( $.support.fixedPosition === undefined ) {
			$.support.fixedPosition = (function() {
				var elem  = $('<div style="position:fixed;top:20px;"></div>').appendTo('body'),
					fixed = ( elem[0].offsetTop === 20 || elem[0].offsetTop === 15 );

				elem.remove();

				return fixed;
			}());
		}

		$.extend(F.defaults, {
			scrollbarWidth : $.scrollbarWidth(),
			fixed  : $.support.fixedPosition,
			parent : $('body')
		});

		//Get real width of page scroll-bar
		w1 = $(window).width();

		H.addClass('fancybox-lock-test');

		w2 = $(window).width();

		H.removeClass('fancybox-lock-test');

		$("<style type='text/css'>.fancybox-margin{margin-right:" + (w2 - w1) + "px;}</style>").appendTo("head");
	});

	$('.fancybox').fancybox();

}(window, document, jQuery));;
/*
jQuery Waypoints - v1.1.7
Copyright (c) 2011-2012 Caleb Troughton
Dual licensed under the MIT license and GPL license.
https://github.com/imakewebthings/jquery-waypoints/blob/master/MIT-license.txt
https://github.com/imakewebthings/jquery-waypoints/blob/master/GPL-license.txt
*/
(function($,k,m,i,d){var e=$(i),g="waypoint.reached",b=function(o,n){o.element.trigger(g,n);if(o.options.triggerOnce){o.element[k]("destroy")}},h=function(p,o){if(!o){return -1}var n=o.waypoints.length-1;while(n>=0&&o.waypoints[n].element[0]!==p[0]){n-=1}return n},f=[],l=function(n){$.extend(this,{element:$(n),oldScroll:0,waypoints:[],didScroll:false,didResize:false,doScroll:$.proxy(function(){var q=this.element.scrollTop(),p=q>this.oldScroll,s=this,r=$.grep(this.waypoints,function(u,t){return p?(u.offset>s.oldScroll&&u.offset<=q):(u.offset<=s.oldScroll&&u.offset>q)}),o=r.length;if(!this.oldScroll||!q){$[m]("refresh")}this.oldScroll=q;if(!o){return}if(!p){r.reverse()}$.each(r,function(u,t){if(t.options.continuous||u===o-1){b(t,[p?"down":"up"])}})},this)});$(n).bind("scroll.waypoints",$.proxy(function(){if(!this.didScroll){this.didScroll=true;i.setTimeout($.proxy(function(){this.doScroll();this.didScroll=false},this),$[m].settings.scrollThrottle)}},this)).bind("resize.waypoints",$.proxy(function(){if(!this.didResize){this.didResize=true;i.setTimeout($.proxy(function(){$[m]("refresh");this.didResize=false},this),$[m].settings.resizeThrottle)}},this));e.load($.proxy(function(){this.doScroll()},this))},j=function(n){var o=null;$.each(f,function(p,q){if(q.element[0]===n){o=q;return false}});return o},c={init:function(o,n){this.each(function(){var u=$.fn[k].defaults.context,q,t=$(this);if(n&&n.context){u=n.context}if(!$.isWindow(u)){u=t.closest(u)[0]}q=j(u);if(!q){q=new l(u);f.push(q)}var p=h(t,q),s=p<0?$.fn[k].defaults:q.waypoints[p].options,r=$.extend({},s,n);r.offset=r.offset==="bottom-in-view"?function(){var v=$.isWindow(u)?$[m]("viewportHeight"):$(u).height();return v-$(this).outerHeight()}:r.offset;if(p<0){q.waypoints.push({element:t,offset:null,options:r})}else{q.waypoints[p].options=r}if(o){t.bind(g,o)}if(n&&n.handler){t.bind(g,n.handler)}});$[m]("refresh");return this},remove:function(){return this.each(function(o,p){var n=$(p);$.each(f,function(r,s){var q=h(n,s);if(q>=0){s.waypoints.splice(q,1);if(!s.waypoints.length){s.element.unbind("scroll.waypoints resize.waypoints");f.splice(r,1)}}})})},destroy:function(){return this.unbind(g)[k]("remove")}},a={refresh:function(){$.each(f,function(r,s){var q=$.isWindow(s.element[0]),n=q?0:s.element.offset().top,p=q?$[m]("viewportHeight"):s.element.height(),o=q?0:s.element.scrollTop();$.each(s.waypoints,function(u,x){if(!x){return}var t=x.options.offset,w=x.offset;if(typeof x.options.offset==="function"){t=x.options.offset.apply(x.element)}else{if(typeof x.options.offset==="string"){var v=parseFloat(x.options.offset);t=x.options.offset.indexOf("%")?Math.ceil(p*(v/100)):v}}x.offset=x.element.offset().top-n+o-t;if(x.options.onlyOnScroll){return}if(w!==null&&s.oldScroll>w&&s.oldScroll<=x.offset){b(x,["up"])}else{if(w!==null&&s.oldScroll<w&&s.oldScroll>=x.offset){b(x,["down"])}else{if(!w&&s.element.scrollTop()>x.offset){b(x,["down"])}}}});s.waypoints.sort(function(u,t){return u.offset-t.offset})})},viewportHeight:function(){return(i.innerHeight?i.innerHeight:e.height())},aggregate:function(){var n=$();$.each(f,function(o,p){$.each(p.waypoints,function(q,r){n=n.add(r.element)})});return n}};$.fn[k]=function(n){if(c[n]){return c[n].apply(this,Array.prototype.slice.call(arguments,1))}else{if(typeof n==="function"||!n){return c.init.apply(this,arguments)}else{if(typeof n==="object"){return c.init.apply(this,[null,n])}else{$.error("Method "+n+" does not exist on jQuery "+k)}}}};$.fn[k].defaults={continuous:true,offset:0,triggerOnce:false,context:i};$[m]=function(n){if(a[n]){return a[n].apply(this)}else{return a.aggregate()}};$[m].settings={resizeThrottle:200,scrollThrottle:100};e.load(function(){$[m]("refresh")})})(jQuery,"waypoint","waypoints",window);;
/**
 * h5Validate
 * 
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * Developed under the sponsorship of RootMusic, and Zumba Fitness
 */

/*global jQuery, window, console */
(function ($) {
	'use strict';
	
	var console = window.console || function () {},
		h5 = { // Public API
			defaults : {
				debug: false,

				RODom: false,

				// HTML5-compatible validation pattern library that can be extended and/or overriden.
				patternLibrary : { //** TODO: Test the new regex patterns. Should I apply these to the new input types?
					// **TODO: password
					phone: /([\+][0-9]{1,3}([ \.\-])?)?([\(][0-9]{1,6}[\)])?([0-9A-Za-z \.\-]{1,32})(([A-Za-z \:]{1,11})?[0-9]{1,4}?)/,

					// Shamelessly lifted from Scott Gonzalez via the Bassistance Validation plugin http://projects.scottsplayground.com/email_address_validation/
					email: /((([a-zA-Z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-zA-Z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?/,

					// Shamelessly lifted from Scott Gonzalez via the Bassistance Validation plugin http://projects.scottsplayground.com/iri/
					url: /(https?|ftp):\/\/(((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?/,

					// Number, including positive, negative, and floating decimal. Credit: bassistance
					number: /-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?/,

					// Date in ISO format. Credit: bassistance
					dateISO: /\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}/,

					alpha: /[a-zA-Z]+/,
					alphaNumeric: /\w+/,
					integer: /-?\d+/
				},

				// The prefix to use for dynamically-created class names.
				classPrefix: 'h5-',

				errorClass: 'ui-state-error', // No prefix for these.
				validClass: 'ui-state-valid', // "
				activeClass: 'active', // Prefix will get prepended.
				requiredClass: 'required',
				requiredAttribute: 'required',
				patternAttribute: 'pattern',

				// Attribute which stores the ID of the error container element (without the hash).
				errorAttribute: 'data-h5-errorid',

				// Events API
				customEvents: {
					'validate': true
				},

				// Setup KB event delegation.
				kbSelectors: ':input:not(:button):not(:disabled):not(.novalidate)',
				focusout: true,
				focusin: false,
				change: true,
				keyup: false,
				activeKeyup: true,

				// Setup mouse event delegation.
				mSelectors: '[type="range"]:not(:disabled):not(.novalidate), :radio:not(:disabled):not(.novalidate), :checkbox:not(:disabled):not(.novalidate), select:not(:disabled):not(.novalidate), option:not(:disabled):not(.novalidate)',
				click: true,

				// What do we name the required .data variable?
				requiredVar: 'h5-required',

				// What do we name the pattern .data variable?
				patternVar: 'h5-pattern',
				stripMarkup: true,

				// Run submit related checks and prevent form submission if any fields are invalid?
				submit: true,

				// Move focus to the first invalid field on submit?
				focusFirstInvalidElementOnSubmit: true,

				// When submitting, validate elements that haven't been validated yet?
				validateOnSubmit: true,

				// Callback stubs
				invalidCallback: function () {},
				validCallback: function () {},

				// Elements to validate with allValid (only validating visible elements)
				allValidSelectors: ':input:visible:not(:button):not(:disabled):not(.novalidate)',

				// Mark field invalid.
				// ** TODO: Highlight labels
				// ** TODO: Implement setCustomValidity as per the spec:
				// http://www.whatwg.org/specs/web-apps/current-work/multipage/association-of-controls-and-forms.html#dom-cva-setcustomvalidity
				markInvalid: function markInvalid(options) {
					var $element = $(options.element),
						$errorID = $(options.errorID);
					$element.addClass(options.errorClass).removeClass(options.validClass);

					// User needs help. Enable active validation.
					$element.addClass(options.settings.activeClass);

					if ($errorID.length) { // These ifs are technically not needed, but improve server-side performance 
						if ($element.attr('title')) {
							$errorID.text($element.attr('title'));
						}
						$errorID.show();
					}
					$element.data('valid', false);
					options.settings.invalidCallback.call(options.element, options.validity);
					return $element;
				},

				// Mark field valid.
				markValid: function markValid(options) {
					var $element = $(options.element),
						$errorID = $(options.errorID);

					$element.addClass(options.validClass).removeClass(options.errorClass);
					if ($errorID.length) {
						$errorID.hide();
					}
					$element.data('valid', true);
					options.settings.validCallback.call(options.element, options.validity);
					return $element;
				},

				// Unmark field
				unmark: function unmark(options) {
					var $element = $(options.element);
					$element.removeClass(options.errorClass).removeClass(options.validClass);
					$element.form.find("#" + options.element.id).removeClass(options.errorClass).removeClass(options.validClass);
					return $element;
				}
			}
		},

		// Aliases
		defaults = h5.defaults,
		patternLibrary = defaults.patternLibrary,

		createValidity = function createValidity(validity) {
			return $.extend({
				customError: validity.customError || false,
				patternMismatch: validity.patternMismatch || false,
				rangeOverflow: validity.rangeOverflow || false,
				rangeUnderflow: validity.rangeUnderflow || false,
				stepMismatch: validity.stepMismatch || false,
				tooLong: validity.tooLong || false,
				typeMismatch: validity.typeMismatch || false,
				valid: validity.valid || true,
				valueMissing: validity.valueMissing || false
			}, validity);
		},

		methods = {
			/**
			 * Check the validity of the current field
			 * @param  {object}  settings   instance settings
			 * @param  {object}  options
			 *			.revalidate - trigger validation function first?
			 * @return {Boolean}
			 */
			isValid: function (settings, options) {
				var $this = $(this);

				options = (settings && options) || {};

				// Revalidate defaults to true
				if (options.revalidate !== false) {
					$this.trigger('validate');
				}

				return $this.data('valid'); // get the validation result
			},
			allValid: function (config, options) {
				var valid = true,
					formValidity = [],
					$this = $(this),
					$allFields,
					$filteredFields,
					radioNames = [],
					getValidity = function getValidity(e, data) {
						data.e = e;
						formValidity.push(data);
					},
					settings = $.extend({}, config, options); // allow options to override settings

				options = options || {};

				$this.trigger('formValidate', {settings: $.extend(true, {}, settings)});

				// Make sure we're not triggering handlers more than we need to.
				$this.undelegate(settings.allValidSelectors,
					'.allValid', getValidity);
				$this.delegate(settings.allValidSelectors,
					'validated.allValid', getValidity);

				$allFields = $this.find(settings.allValidSelectors);

				// Filter radio buttons with the same name and keep only one,
				// since they will be checked as a group by isValid()
				$filteredFields = $allFields.filter(function(index) {
					var name;

					if(this.tagName === "INPUT"
						&& this.type === "radio") {
						name = this.name;
						if(radioNames[name] === true) {
							return false;
						}
						radioNames[name] = true;
					}
					return true;
				});

				$filteredFields.each(function () {
					var $this = $(this);
					valid = $this.h5Validate('isValid', options) && valid;
				});

				$this.trigger('formValidated', {valid: valid, elements: formValidity});
				return valid;
			},
			validate: function (settings) {
				// Get the HTML5 pattern attribute if it exists.
				// ** TODO: If a pattern class exists, grab the pattern from the patternLibrary, but the pattern attrib should override that value.
				var $this = $(this),
					pattern = $this.filter('[pattern]')[0] ? $this.attr('pattern') : false,

					// The pattern attribute must match the whole value, not just a subset:
					// "...as if it implied a ^(?: at the start of the pattern and a )$ at the end."
					re = new RegExp('^(?:' + pattern + ')$'),
					$radiosWithSameName = null,
					value = ($this.is('[type=checkbox]')) ?
							$this.is(':checked') : ($this.is('[type=radio]') ?
								// Cache all radio buttons (in the same form) with the same name as this one
								($radiosWithSameName = $this.parents('form')
									// **TODO: escape the radio buttons' name before using it in the jQuery selector
									.find('input[name="' + $this.attr('name') + '"]'))
									.filter(':checked')
									.length > 0 : $this.val()),
					errorClass = settings.errorClass,
					validClass = settings.validClass,
					errorIDbare = $this.attr(settings.errorAttribute) || false, // Get the ID of the error element.
					errorID = errorIDbare ? '#' + errorIDbare.replace(/(:|\.|\[|\])/g,'\\$1') : false, // Add the hash for convenience. This is done in two steps to avoid two attribute lookups.
					required = false,
					validity = createValidity({element: this, valid: true}),
					$checkRequired = $('<input required>'),
					maxlength;

				/*	If the required attribute exists, set it required to true, unless it's set 'false'.
				*	This is a minor deviation from the spec, but it seems some browsers have falsey 
				*	required values if the attribute is empty (should be true). The more conformant 
				*	version of this failed sanity checking in the browser environment.
				*	This plugin is meant to be practical, not ideologically married to the spec.
				*/
				// Feature fork
				if ($checkRequired.filter('[required]') && $checkRequired.filter('[required]').length) {
					required = ($this.filter('[required]').length && $this.attr('required') !== 'false');
				} else {
					required = ($this.attr('required') !== undefined);
				}

				if (settings.debug && window.console) {
					console.log('Validate called on "' + value + '" with regex "' + re + '". Required: ' + required); // **DEBUG
					console.log('Regex test: ' + re.test(value) + ', Pattern: ' + pattern); // **DEBUG
				}

				maxlength = parseInt($this.attr('maxlength'), 10);
				if (!isNaN(maxlength) && value.length > maxlength) {
						validity.valid = false;	
						validity.tooLong = true;
				}

				if (required && !value) {
					validity.valid = false;
					validity.valueMissing = true;
				} else if (pattern && !re.test(value) && value) {
					validity.valid = false;
					validity.patternMismatch = true;
				} else {
					if (!settings.RODom) {
						settings.markValid({
							element: this,
							validity: validity,
							errorClass: errorClass,
							validClass: validClass,
							errorID: errorID,
							settings: settings
						});
					}
				}

				if (!validity.valid) {
					if (!settings.RODom) {
						settings.markInvalid({
							element: this,
							validity: validity,
							errorClass: errorClass,
							validClass: validClass,
							errorID: errorID,
							settings: settings
						});
					}
				}
				$this.trigger('validated', validity);

				// If it's a radio button, also validate the other radio buttons with the same name
				// (while making sure the call is not recursive)
				if($radiosWithSameName !== null
					&& settings.alreadyCheckingRelatedRadioButtons !== true) {

					settings.alreadyCheckingRelatedRadioButtons = true;

					$radiosWithSameName
						.not($this)
						.trigger('validate');

					settings.alreadyCheckingRelatedRadioButtons = false;

				}
			},

			/**
			 * Take the event preferences and delegate the events to selected
			 * objects.
			 * 
			 * @param {object} eventFlags The object containing event flags.
			 * 
			 * @returns {element} The passed element (for method chaining).
			 */
			delegateEvents: function (selectors, eventFlags, element, settings) {
				var events = {},
					key = 0,
					validate = function () {
						settings.validate.call(this, settings);
					};
				$.each(eventFlags, function (key, value) {
					if (value) {
						events[key] = key;
					}
				});
				// key = 0;
				for (key in events) {
					if (events.hasOwnProperty(key)) {
						$(element).delegate(selectors, events[key] + '.h5Validate', validate);
					}
				}
				return element;
			},
			/**
			 * Prepare for event delegation.
			 * 
			 * @param {object} settings The full plugin state, including
			 * options. 
			 * 
			 * @returns {object} jQuery object for chaining.
			 */
			bindDelegation: function (settings) {
				var $this = $(this),
					$forms;
				// Attach patterns from the library to elements.
				// **TODO: pattern / validation method matching should
				// take place inside the validate action.
				$.each(patternLibrary, function (key, value) {
					var pattern = value.toString();
					pattern = pattern.substring(1, pattern.length - 1);
					$('.' + settings.classPrefix + key).attr('pattern', pattern);
				});

				$forms = $this.filter('form')
						.add($this.find('form'))
						.add($this.parents('form'));

				$forms
					.attr('novalidate', 'novalidate')
					.submit(checkValidityOnSubmitHandler);
					
				$forms.find("input[formnovalidate][type='submit']").click(function(){
					$(this).closest("form").unbind('submit', checkValidityOnSubmitHandler);
				});

				return this.each(function () {
					var kbEvents = {
							focusout: settings.focusout,
							focusin: settings.focusin,
							change: settings.change,
							keyup: settings.keyup
						},
						mEvents = {
							click: settings.click
						},
						activeEvents = {
							keyup: settings.activeKeyup
						};

					settings.delegateEvents(':input', settings.customEvents, this, settings);
					settings.delegateEvents(settings.kbSelectors, kbEvents, this, settings);
					settings.delegateEvents(settings.mSelectors, mEvents, this, settings);
					settings.delegateEvents(settings.activeClassSelector, activeEvents, this, settings);
					settings.delegateEvents('textarea[maxlength]', {keyup: true}, this, settings);
				});
			}
		},

		/**
		 * Event handler for the form submit event.
		 * When settings.submit is enabled:
		 *  - prevents submission if any invalid fields are found.
		 *  - Optionally validates all fields.
		 *  - Optionally moves focus to the first invalid field.
		 * 
		 * @param {object} evt The jQuery Event object as from the submit event. 
		 * 
		 * @returns {object} undefined if no validation was done, true if validation passed, false if validation didn't.
		 */
		checkValidityOnSubmitHandler = function(evt) {

			var $this,
				settings = getInstance.call(this),
				allValid;

			if(settings.submit !== true) {
				return;
			}

			$this = $(this);
			allValid = $this.h5Validate('allValid', { revalidate: settings.validateOnSubmit === true });

			if(allValid !== true) {
				evt.preventDefault();

				if(settings.focusFirstInvalidElementOnSubmit === true){
					var $invalid = $(settings.allValidSelectors, $this)
									.filter(function(index){
										return $(this).h5Validate('isValid', { revalidate: false }) !== true;
									});

					$invalid.first().focus();
				}
			}

			return allValid;
		},

		instances = [],

		buildSettings = function buildSettings(options) {
			// Combine defaults and options to get current settings.
			var settings = $.extend({}, defaults, options, methods),
				activeClass = settings.classPrefix + settings.activeClass;

			return $.extend(settings, {
				activeClass: activeClass,
				activeClassSelector: '.' + activeClass,
				requiredClass: settings.classPrefix + settings.requiredClass,
				el: this
			});
		},

		getInstance = function getInstance() {
			var $parent = $(this).closest('[data-h5-instanceId]');
			return instances[$parent.attr('data-h5-instanceId')];
		},

		setInstance = function setInstance(settings) {
			var instanceId = instances.push(settings) - 1;
			if (settings.RODom !== true) {
				$(this).attr('data-h5-instanceId', instanceId);
			}
			$(this).trigger('instance', { 'data-h5-instanceId': instanceId });
		};

	$.h5Validate = {
		/**
		 * Take a map of pattern names and HTML5-compatible regular
		 * expressions, and add them to the patternLibrary. Patterns in
		 * the library are automatically assigned to HTML element pattern
		 * attributes for validation.
		 * 
		 * @param {Object} patterns A map of pattern names and HTML5 compatible
		 * regular expressions.
		 * 
		 * @returns {Object} patternLibrary The modified pattern library
		 */
		addPatterns: function (patterns) {
			var patternLibrary = defaults.patternLibrary,
				key;
			for (key in patterns) {
				if (patterns.hasOwnProperty(key)) {
					patternLibrary[key] = patterns[key];
				}
			}
			return patternLibrary;
		},
		/**
		 * Take a valid jQuery selector, and a list of valid values to
		 * validate against.
		 * If the user input isn't in the list, validation fails.
		 * 
		 * @param {String} selector Any valid jQuery selector.
		 *
		 * @param {Array} values A list of valid values to validate selected 
		 * fields against.
		 */
		validValues: function (selector, values) {
			var i = 0,
				ln = values.length,
				pattern = '',
				re;
			// Build regex pattern
			for (i = 0; i < ln; i += 1) {
				pattern = pattern ? pattern + '|' + values[i] : values[i];
			}
			re = new RegExp('^(?:' + pattern + ')$');
			$(selector).data('regex', re);
		}
	};

	$.fn.h5Validate = function h5Validate(options) {
		var	action,
			args,
			settings;

		if (typeof options === 'string' && typeof methods[options] === 'function') {
			// Whoah, hold on there! First we need to get the instance:
			settings = getInstance.call(this);

			args = [].slice.call(arguments, 0);
			action = options;
			args.shift();
			args = $.merge([settings], args);

			// Use settings here so we can plug methods into the instance dynamically?
			return settings[action].apply(this, args);
		}

		settings = buildSettings.call(this, options);
		setInstance.call(this, settings);

		// Returning the jQuery object allows for method chaining.
		return methods.bindDelegation.call(this, settings);
	};
	// Validate form
	$('form.checkout').h5Validate({
        errorClass:'validate'
    });
}(jQuery));
		
;
/** ==========================================================

* jquery lightSlider.js v1.1.1
* http://sachinchoolur.github.io/lightslider/
* Released under the MIT License - http://opensource.org/licenses/mit-license.html  ---- FREE ----

=========================================================/**/
;
(function ($, undefined) {
    "use strict";
    var defaults = {
        item: 3,
        autoWidth: false,
        slideMove: 1,
        slideMargin: 10,
        addClass: '',
        mode: "slide",
        useCSS: true,
        cssEasing: 'ease', //'cubic-bezier(0.25, 0, 0.25, 1)',//
        easing: 'linear', //'for jquery animation',//
        speed: 400, //ms'
        auto: false,
        loop: false,
        slideEndAnimatoin: true,
        pause: 2000,
        keyPress: false,
        controls: true,
        prevHtml: '',
        nextHtml: '',
        rtl: false,
        adaptiveHeight: false,
        vertical: false,
        verticalHeight: 500,
        vThumbWidth: 100,
        thumbItem: 10,
        pager: true,
        gallery: false,
        galleryMargin: 5,
        thumbMargin: 5,
        currentPagerPosition: 'middle',
        enableTouch: true,
        enableDrag: true,
        freeMove: true,
        swipeThreshold: 40,
        responsive: [],
        onBeforeStart: function ($el) {},
        onSliderLoad: function ($el) {},
        onBeforeSlide: function ($el, scene) {},
        onAfterSlide: function ($el, scene) {},
        onBeforeNextSlide: function ($el, scene) {},
        onBeforePrevSlide: function ($el, scene) {}
    };
    $.fn.lightSlider = function (options) {
        if (this.length === 0) {
            return this;
        }

        if (this.length > 1) {
            this.each(function () {
                $(this).lightSlider(options);
            });
            return this;
        }

        var plugin = {},
            settings = $.extend(true, {}, defaults, options),
            settingsTemp = {},
            $el = this;
        plugin.$el = this;

        if (settings.mode === 'fade') {
            settings.vertical = false;
        }
        var $children = $el.children(),
            windowW = $(window).width(),
            breakpoint = null,
            resposiveObj = null,
            length = 0,
            w = 0,
            on = false,
            elSize = 0,
            $slide = '',
            scene = 0,
            property = (settings.vertical === true) ? "height" : "width",
            gutter = (settings.vertical === true) ? "margin-bottom" : "margin-right",
            slideValue = 0,
            pagerWidth = 0,
            slideWidth = 0,
            thumbWidth = 0,
            interval = null,
            isTouch = ('ontouchstart' in document.documentElement);
        var refresh = new Object();

        refresh.chbreakpoint = function () {
            windowW = $(window).width();
            if (settings.responsive.length) {
                if (settings.autoWidth === false) {
                    var item = settings.item;
                }
                if (windowW < settings.responsive[0].breakpoint) {
                    for (var i = 0; i < settings.responsive.length; i++) {
                        if (windowW < settings.responsive[i].breakpoint) {
                            breakpoint = settings.responsive[i].breakpoint;
                            resposiveObj = settings.responsive[i];
                        }
                    }
                }
                if (typeof resposiveObj !== "undefined" && resposiveObj != null) {
                    for (i in resposiveObj.settings) {
                        if (typeof settingsTemp[i] == "undefined" || settingsTemp[i] == null) {
                            settingsTemp[i] = settings[i];
                        }
                        settings[i] = resposiveObj.settings[i];
                    }
                }
                if (!$.isEmptyObject(settingsTemp) && windowW > settings.responsive[0].breakpoint) {
                    for (i in settingsTemp) {
                        settings[i] = settingsTemp[i];
                    }
                }
                if (settings.autoWidth === false) {
                    if (slideValue > 0 && slideWidth > 0) {
                        if (item !== settings.item) {
                            scene = Math.round(slideValue / ((slideWidth + settings.slideMargin) * settings.slideMove));
                        }
                    }
                }
            }
        };

        refresh.calSW = function () {
            if (settings.autoWidth === false) {
                slideWidth = (elSize - ((settings.item * (settings.slideMargin)) - settings.slideMargin)) / settings.item;
            }
        };

        refresh.calWidth = function (cln) {
            var ln = cln === true ? $slide.find('.lslide').length : $children.length;
            if (settings.autoWidth === false) {
                w = ln * (slideWidth + settings.slideMargin);
            } else {
                w = 0;
                for (var i = 0; i < ln; i++) {
                    w += (parseInt($children.eq(i).width()) + settings.slideMargin);
                }
            }
            if (w % 1 !== 0) {
                w = w + 1;
            }
            return w;
        };
        plugin = {
            doCss: function () {
                var support = function () {
                    var transition = ['transition', 'MozTransition', 'WebkitTransition', 'OTransition', 'msTransition', 'KhtmlTransition'];
                    var root = document.documentElement;
                    for (var i = 0; i < transition.length; i++) {
                        if (transition[i] in root.style) {
                            return true;
                        }
                    }
                };
                if (settings.useCSS && support()) {
                    return true;
                }
                return false;
            },
            keyPress: function () {
                if (settings.keyPress) {
                    $(document).on('keyup.lightslider', function (e) {
                        e.preventDefault();
                        if (e.keyCode === 37) {
                            $el.goToPrevSlide();
                            clearInterval(interval);
                        } else if (e.keyCode === 39) {
                            $el.goToNextSlide();
                            clearInterval(interval);
                        }
                    });
                }
            },
            controls: function () {
                if (settings.controls) {
                    $el.after('<div class="lSAction"><a class="lSPrev">' + settings.prevHtml + '</a><a class="lSNext">' + settings.nextHtml + '</a></div>');
                    if (!settings.autoWidth) {
                        if (length <= settings.item) {
                            $slide.find('.lSAction').hide();
                        }
                    } else {
                        if (refresh.calWidth(false) < elSize) {
                            $slide.find('.lSAction').hide();
                        }
                    }
                    $slide.find('.lSAction a').on('click', function (e) {
                        e.preventDefault();
                        if ($(this).attr('class') === 'lSPrev') {
                            $el.goToPrevSlide();
                        } else {
                            $el.goToNextSlide();
                        }
                        clearInterval(interval);
                        return false;
                    });
                }
            },
            initialStyle: function () {
                var $this = this;
                if (settings.mode === 'fade') {
                    settings.autoWidth = false;
                    settings.slideEndAnimatoin = false;
                }
                if (settings.auto) {
                    settings.slideEndAnimatoin = false;
                };
                if (settings.autoWidth) {
                    settings.slideMove = 1;
                    settings.item = 1;
                }
                if (settings.loop) {
                    settings.slideMove = 1;
                    settings.freeMove = false;
                }
                settings.onBeforeStart.call(this, $el);
                refresh.chbreakpoint();
                $el.addClass('lightSlider').wrap("<div class='lSSlideOuter " + settings.addClass + "'><div class='lSSlideWrapper'></div></div>");
                $slide = $el.parent('.lSSlideWrapper');
                if (settings.rtl === true) {
                    $slide.parent().addClass('lSrtl');
                }
                if (settings.vertical) {
                    $slide.parent().addClass('vertical');
                    elSize = settings.verticalHeight;
                    $slide.css('height', elSize + 'px');
                } else {
                    elSize = $el.outerWidth();
                }
                $children.addClass('lslide');
                if (settings.loop === true && settings.mode === 'slide') {
                    refresh.calSW();
                    refresh.clone = function () {
                        if (refresh.calWidth(true) > elSize) {
                            /**/
                            var tWr = 0,
                                tI = 0;
                            for (var k = 0; k < $children.length; k++) {
                                tWr += (parseInt($el.find('.lslide').eq(k).width()) + settings.slideMargin);
                                tI++;
                                if (tWr >= (elSize + settings.slideMargin)) {
                                    break;
                                }
                            }
                            var tItem = settings.autoWidth === true ? tI : settings.item;

                            /**/
                            if (tItem < $el.find('.clone.left').length) {
                                for (var i = 0; i < $el.find('.clone.left').length - tItem; i++) {
                                    $children.eq(i).remove();
                                }
                            }
                            if (tItem < $el.find('.clone.right').length) {
                                for (var j = $children.length - 1; j > ($children.length - 1 - $el.find('.clone.right').length); j--) {
                                    scene--;
                                    $children.eq(j).remove();
                                }
                            }
                            /**/
                            for (var k = $el.find('.clone.right').length; k < tItem; k++) {
                                $el.find('.lslide').eq(k).clone().removeClass('lslide').addClass('clone right').appendTo($el);
                                scene++;
                            }
                            for (var m = $el.find('.lslide').length - $el.find('.clone.left').length; m > ($el.find('.lslide').length - tItem); m--) {
                                $el.find('.lslide').eq(m - 1).clone().removeClass('lslide').addClass('clone left').prependTo($el);
                            }
                            $children = $el.children();
                        } else {
                            if ($children.hasClass('clone')) {
                                $el.find('.clone').remove();
                                $this.move($el, 0);
                            }
                        }
                    };
                    refresh.clone();
                }
                refresh.sSW = function () {
                    length = $children.length;
                    if (settings.rtl === true && settings.vertical === false) {
                        gutter = "margin-left";
                    }
                    if (settings.autoWidth === false) {
                        $children.css(property, slideWidth + 'px');
                    }
                    $children.css(gutter, settings.slideMargin + 'px');
                    w = refresh.calWidth(false);
                    $el.css(property, w + 'px');
                    if (settings.loop === true && settings.mode === 'slide') {
                        if (on === false) {
                            scene = $el.find('.clone.left').length;
                        }
                    }
                };
                refresh.calL = function () {
                    $children = $el.children();
                    length = $children.length;
                };
                if (this.doCss()) {
                    $slide.addClass('usingCss');
                }
                refresh.calL();
                if (settings.mode === "slide") {
                    refresh.calSW();
                    refresh.sSW();
                    if (settings.loop === true) {
                        slideValue = $this.slideValue();
                        this.move($el, slideValue);
                    }
                    if (settings.vertical === false) {
                        this.setHeight($el, false, true);
                    }

                } else {
                    this.setHeight($el, true, true);
                    $el.addClass('lSFade');
                    if (!this.doCss()) {
                        $children.not(".active").css('display', 'none');
                    }
                }
                if (settings.loop === true && settings.mode === 'slide') {
                    $children.eq(scene).addClass('active');
                } else {
                    $children.first().addClass('active');
                }
            },
            pager: function () {
                var $this = this;
                refresh.createPager = function () {
                    thumbWidth = (elSize - ((settings.thumbItem * (settings.thumbMargin)) - settings.thumbMargin)) / settings.thumbItem;
                    var $children = $slide.find('.lslide');
                    var length = $slide.find('.lslide').length;
                    var i = 0,
                        pagers = '',
                        v = 0;
                    for (i = 0; i < length; i++) {
                        if (settings.mode === 'slide') {
                            // calculate scene * slide value
                            if (!settings.autoWidth) {
                                v = i * ((slideWidth + settings.slideMargin) * settings.slideMove);
                            } else {
                                v += ((parseInt($children.eq(i).width()) + settings.slideMargin) * settings.slideMove);
                            }
                        }
                        var thumb = $children.eq(i * settings.slideMove).attr('data-thumb');
                        if (settings.gallery === true) {
                            pagers += '<li style="width:100%;' + property + ':' + thumbWidth + 'px;' + gutter + ':' + settings.thumbMargin + 'px"><a href="#"><img src="' + thumb + '" /></a></li>';
                        } else {
                            pagers += '<li><a href="#">' + (i + 1) + '</a></li>';
                        }
                        if (settings.mode === 'slide') {
                            if ((v) >= w - elSize - settings.slideMargin) {
                                i = i + 1;
                                var minPgr = 2;
                                if (settings.autoWidth) {
                                    pagers += '<li><a href="#">' + (i + 1) + '</a></li>';
                                    minPgr = 1;
                                }
                                if (i < minPgr) {
                                    pagers = null;
                                    $slide.parent().addClass('noPager');
                                } else {
                                    $slide.parent().removeClass('noPager');
                                }
                                break;
                            }
                        }
                    }
                    var $cSouter = $slide.parent();
                    $cSouter.find('.lSPager').html(pagers);
                    if (!settings.vertical && settings.gallery) {
                        var $pgr = $slide.parent().find('.lSGallery');
                        setTimeout(function () {
                            $this.setHeight($pgr, false, false);
                        });
                    }
                    if (settings.gallery === true) {
                        if (settings.vertical === true) {
                            // set Gallery thumbnail width
                            $cSouter.find('.lSPager').css('width', settings.vThumbWidth + 'px');
                        }
                        pagerWidth = (i * (settings.thumbMargin + thumbWidth)) + 0.5;
                        $cSouter.find('.lSPager').css({
                            property: pagerWidth + 'px',
                            'transition-duration': settings.speed + 'ms'
                        });
                        if (settings.vertical === true) {
                            $slide.parent().css('padding-right', (settings.vThumbWidth + settings.galleryMargin) + 'px');
                        }
                        $cSouter.find('.lSPager').css(property, pagerWidth + 'px');
                    }
                    var $pager = $cSouter.find('.lSPager').find('li');
                    $pager.first().addClass('active');
                    $pager.on('click', function () {
                        if (settings.loop === true && settings.mode === 'slide') {
                            scene = scene + ($pager.index(this) - $cSouter.find('.lSPager').find('li.active').index());
                        } else {
                            scene = $pager.index(this);
                        }
                        $el.mode(false);
                        if (settings.gallery === true) {
                            $this.slideThumb();
                        }
                        clearInterval(interval);
                        return false;
                    });
                };
                if (settings.pager) {
                    var cl = 'lSpg';
                    if (settings.gallery) {
                        cl = 'lSGallery';
                    }
                    $slide.after('<ul class="lSPager ' + cl + '"></ul>');
                    var gMargin = (settings.vertical) ? "margin-left" : "margin-top";
                    $slide.parent().find('.lSPager').css(gMargin, settings.galleryMargin + 'px');
                    refresh.createPager();
                }
                
                setTimeout(function () {
                    refresh.init();
                }, 0);
            },
            setHeight: function (ob, fade, loop) {
                var obj = null;
                if (loop) {
                    obj = ob.children(".lslide ").first();
                }else{
                    obj = ob.children().first();
                }
                var setCss = function () {
                    var tH = obj.height(),
                        tP = 0,
                        tHT = tH;
                    if (fade) {
                        tH = 0;
                        tP = ((tHT) * 100) / elSize;
                    }
                    ob.css({
                        'height': tH + 'px',
                        'padding-bottom': tP + '%'
                    });
                };
                setCss();
                obj.find('img').load(function () {
                    setTimeout(function(){
                        setCss();
                    },100);
                });
            },
            active: function (ob, t) {
                if (this.doCss() && settings.mode === "fade") {
                    $slide.addClass('on');
                }
                var sc = 0;
                if (scene * settings.slideMove < length) {
                    ob.removeClass('active');
                    if (!this.doCss() && settings.mode === "fade" && t === false) {
                        ob.fadeOut(settings.speed);
                    }
                    t === true ? sc = scene : sc = scene * settings.slideMove;
                    if (t === true) {
                        var l = ob.length;
                        var nl = l - 1;
                        if (sc + 1 >= l) {
                            sc = nl;
                        }
                    }
                    if (settings.loop === true && settings.mode === 'slide') {
                        t === true ? sc = scene - $el.find('.clone.left').length : sc = scene * settings.slideMove;
                        if (t === true) {
                            var l = ob.length;
                            var nl = l - 1;
                            if (sc + 1 == l) {
                                sc = nl;
                            } else if (sc + 1 > l) {
                                sc = 0;
                            }
                        }
                    }

                    if (!this.doCss() && settings.mode === "fade" && t === false) {
                        ob.eq(sc).fadeIn(settings.speed);
                    }
                    ob.eq(sc).addClass('active');
                } else {
                    ob.removeClass('active');
                    ob.eq(ob.length - 1).addClass('active');
                    if (!this.doCss() && settings.mode === "fade" && t === false) {
                        ob.fadeOut(settings.speed);
                        ob.eq(sc).fadeIn(settings.speed);
                    }
                }
            },
            move: function (ob, v) {
                if (settings.rtl === true) {
                    v = -v;
                }
                if (this.doCss()) {
                    if (settings.vertical === true) {
                        ob.css({
                            'transform': 'translate3d(0px, ' + (-v) + 'px, 0px)',
                            '-webkit-transform': 'translate3d(0px, ' + (-v) + 'px, 0px)'
                        });
                    } else {
                        ob.css({
                            'transform': 'translate3d(' + (-v) + 'px, 0px, 0px)',
                            '-webkit-transform': 'translate3d(' + (-v) + 'px, 0px, 0px)',
                        });
                    }
                } else {
                    if (settings.vertical === true) {
                        ob.css('position', 'relative').animate({
                            top: -v + 'px'
                        }, settings.speed, settings.easing);
                    } else {
                        ob.css('position', 'relative').animate({
                            left: -v + 'px'
                        }, settings.speed, settings.easing);
                    }
                }
                var $thumb = $slide.parent().find('.lSPager').find('li');
                this.active($thumb, true);
            },
            fade: function () {
                this.active($children, false);
                var $thumb = $slide.parent().find('.lSPager').find('li');
                this.active($thumb, true);
            },
            slide: function () {
                var $this = this;
                refresh.calSlide = function () {
                    if (w > elSize) {
                        slideValue = $this.slideValue();
                        $this.active($children, false);
                        if ((slideValue) > w - elSize - settings.slideMargin) {
                            slideValue = w - elSize - settings.slideMargin;
                        } else if (slideValue < 0) {
                            slideValue = 0;
                        }
                        $this.move($el, slideValue);
                        if (settings.loop === true && settings.mode === 'slide') {
                            if (scene >= (length - ($el.find('.clone.left').length / settings.slideMove))) {
                                $this.resetSlide($el.find('.clone.left').length);
                            }
                            if (scene === 0) {
                                $this.resetSlide($slide.find('.lslide').length);
                            }
                        }
                    }
                };
                refresh.calSlide();
            },
            resetSlide: function (s) {
                var $this = this;
                $slide.find('.lSAction a').addClass('disabled');
                setTimeout(function () {
                    scene = s;
                    $slide.css('transition-duration', '0ms');
                    slideValue = $this.slideValue();
                    $this.active($children, false);
                    plugin.move($el, slideValue);
                    setTimeout(function () {
                        $slide.css('transition-duration', settings.speed + 'ms');
                        $slide.find('.lSAction a').removeClass('disabled');
                    }, 50);
                }, settings.speed + 100);
            },
            slideValue: function () {
                var _sV = 0;
                if (settings.autoWidth === false) {
                    _sV = scene * ((slideWidth + settings.slideMargin) * settings.slideMove);
                } else {
                    _sV = 0;
                    for (var i = 0; i < scene; i++) {
                        _sV += (parseInt($children.eq(i).width()) + settings.slideMargin);
                    }
                }
                return _sV;
            },
            slideThumb: function () {
                var position;
                switch (settings.currentPagerPosition) {
                case 'left':
                    position = 0;
                    break;
                case 'middle':
                    position = (elSize / 2) - (thumbWidth / 2);
                    break;
                case 'right':
                    position = elSize - thumbWidth;
                }
                var sc = scene - $el.find('.clone.left').length;
                var $pager = $slide.parent().find('.lSPager');
                if (settings.mode === 'slide' && settings.loop === true) {
                    if (sc >= $pager.children().length) {
                        sc = 0;
                    } else if (sc < 0) {
                        sc = $pager.children().length;
                    }
                }
                var thumbSlide = sc * ((thumbWidth + settings.thumbMargin)) - (position);
                if ((thumbSlide + elSize) > pagerWidth) {
                    thumbSlide = pagerWidth - elSize - settings.thumbMargin;
                }
                if (thumbSlide < 0) {
                    thumbSlide = 0;
                }
                this.move($pager, thumbSlide);
            },
            auto: function () {
                if (settings.auto) {
                    interval = setInterval(function () {
                        $el.goToNextSlide();
                    }, settings.pause);
                }
            },

            touchMove: function (endCoords, startCoords) {
                $slide.css('transition-duration', '0ms');
                if (settings.mode === 'slide') {
                    var distance = endCoords - startCoords;
                    var swipeVal = slideValue - distance;
                    if ((swipeVal) >= w - elSize - settings.slideMargin) {
                        if (settings.freeMove === false) {
                            swipeVal = w - elSize - settings.slideMargin;
                        } else {
                            var swipeValT = w - elSize - settings.slideMargin;
                            swipeVal = swipeValT + ((swipeVal - swipeValT) / 5);

                        }
                    } else if (swipeVal < 0) {
                        if (settings.freeMove === false) {
                            swipeVal = 0;
                        } else {
                            swipeVal = swipeVal / 5;
                        }
                    }
                    this.move($el, swipeVal);
                }
            },

            touchEnd: function (distance) {
                $slide.css('transition-duration', settings.speed + 'ms');
                clearInterval(interval);
                if (settings.mode === 'slide') {
                    var mxVal = false;
                    var _next = true;
                    slideValue = slideValue - distance;
                    if ((slideValue) > w - elSize - settings.slideMargin) {
                        slideValue = w - elSize - settings.slideMargin;
                        if (settings.autoWidth === false) {
                            mxVal = true;
                        }
                    } else if (slideValue < 0) {
                        slideValue = 0;
                    }
                    var gC = function (next) {
                        var ad = 0;
                        if (!mxVal) {
                            if (next) {
                                ad = 1;
                            };
                        }
                        if (!settings.autoWidth) {
                            var num = slideValue / ((slideWidth + settings.slideMargin) * settings.slideMove);
                            scene = parseInt(num) + ad;
                            if (slideValue >= (w - elSize - settings.slideMargin)) {
                                if (num % 1 !== 0) {
                                    scene++;
                                }
                            }
                        } else {
                            var tW = 0;
                            for (var i = 0; i < $children.length; i++) {
                                tW += (parseInt($children.eq(i).width()) + settings.slideMargin);
                                scene = i + ad;
                                if (tW >= slideValue) {
                                    break;
                                }
                            }
                        }
                    };
                    if (distance >= settings.swipeThreshold) {
                        gC(false);
                        _next = false;
                    } else if (distance <= -settings.swipeThreshold) {
                        gC(true);
                        _next = false;
                    }
                    $el.mode(_next);
                    this.slideThumb();
                } else {
                    if (distance >= settings.swipeThreshold) {
                        $el.goToPrevSlide();
                    } else if (distance <= -settings.swipeThreshold) {
                        $el.goToNextSlide();
                    }
                }
            },



            enableDrag: function () {
                var $this = this;
                if (!isTouch) {
                    var startCoords = 0,
                        endCoords = 0,
                        isDraging = false;
                    $slide.on('mousedown', function (e) {
                        if (w < elSize) {
                            if (w !== 0) {
                                return false;
                            }
                        }
                        if ($(e.target).attr('class') !== ('lSPrev') && $(e.target).attr('class') !== ('lSNext')) {
                            startCoords = (settings.vertical === true) ? e.pageY : e.pageX;
                            isDraging = true;
                            e.preventDefault();
                        }
                    });
                    $(window).on('mousemove', function (e) {
                        if (isDraging) {
                            endCoords = (settings.vertical === true) ? e.pageY : e.pageX;
                            $this.touchMove(endCoords, startCoords);
                        }
                    });
                    $(window).on('mouseup', function (e) {
                        if (isDraging) {
                            isDraging = false;
                            endCoords = (settings.vertical === true) ? e.pageY : e.pageX;
                            var distance = endCoords - startCoords;
                            if (Math.abs(distance) >= settings.swipeThreshold) {
                                $(window).on('click.ls', function(e) {
                                    e.preventDefault();
                                    e.stopImmediatePropagation();
                                    e.stopPropagation();
                                    $(window).off('click.ls');
                                });
                            }

                            $this.touchEnd(distance);

                        }
                    });
                }
            },




            enableTouch: function () {
                var $this = this;
                if (isTouch) {
                    var startCoords = {},
                        endCoords = {};
                    $slide.on('touchstart', function (e) {
                        endCoords = e.originalEvent.targetTouches[0];
                        startCoords.pageX = e.originalEvent.targetTouches[0].pageX;
                        startCoords.pageY = e.originalEvent.targetTouches[0].pageY;
                    });
                    $slide.on('touchmove', function (e) {
                        if (w < elSize) {
                            if (w !== 0) {
                                return false;
                            }
                        }
                        var orig = e.originalEvent;
                        endCoords = orig.targetTouches[0];
                        var xMovement = Math.abs(endCoords.pageX - startCoords.pageX);
                        var yMovement = Math.abs(endCoords.pageY - startCoords.pageY);
                        if (settings.vertical === true) {
                            if ((yMovement * 3) > xMovement) {
                                e.preventDefault();
                            }
                            $this.touchMove(endCoords.pageY, startCoords.pageY);
                        } else {
                            if ((xMovement * 3) > yMovement) {
                                e.preventDefault();
                            }
                            $this.touchMove(endCoords.pageX, startCoords.pageX);
                        }

                    });
                    $slide.on('touchend', function () {
                        if (w < elSize) {
                            if (w !== 0) {
                                return false;
                            }
                        }
                        if (settings.vertical === true) {
                            var distance = endCoords.pageY - startCoords.pageY;
                        } else {
                            var distance = endCoords.pageX - startCoords.pageX;
                        }
                        $this.touchEnd(distance);
                    });
                }
            },
            build: function () {
                var $this = this;
                $this.initialStyle();
                $this.auto();
                if (this.doCss()) {

                    if (settings.enableTouch === true) {
                        $this.enableTouch();
                    }
                    if (settings.enableDrag === true) {
                        $this.enableDrag();
                    }
                }
                $this.pager();
                $this.controls();
                $this.keyPress();
            }
        };
        plugin.build();
        refresh.init = function () {
            refresh.chbreakpoint();
            if (settings.vertical === true) {
                if (settings.item > 1) {
                    elSize = settings.verticalHeight;
                } else {
                    elSize = $children.outerHeight();
                }
                $slide.css('height', elSize + 'px');
            } else {
                elSize = $slide.outerWidth();
            }
            if (settings.loop === true && settings.mode === 'slide') {
                refresh.clone();
            }
            refresh.calL();
            if (settings.mode === "slide") {
                $el.removeClass('lSSlide');
            }
            if (settings.mode === "slide") {
                refresh.calSW();
                refresh.sSW();
            }
            setTimeout(function () {
                if (settings.mode === "slide") {
                    $el.addClass('lSSlide');
                }
            }, 1000);
            if (settings.pager) {
                refresh.createPager();
            }
            if (settings.adaptiveHeight === true && settings.vertical === false) {
                $el.css('height', $children.eq(scene).height());
            }
            if (settings.gallery === true) {
                plugin.slideThumb();
            }
            if (settings.mode === "slide") {
                plugin.slide();
            }
            if (settings.autoWidth === false) {
                if ($children.length <= settings.item) {
                    $slide.find('.lSAction').hide();
                } else {
                    $slide.find('.lSAction').show();
                }
            } else {
                if ((refresh.calWidth(false) < elSize) && (w !== 0)) {
                    $slide.find('.lSAction').hide();
                } else {
                    $slide.find('.lSAction').show();
                }
            }
        };
        $el.goToPrevSlide = function () {
            if (scene > 0) {
                settings.onBeforePrevSlide.call(this, $el, scene);
                scene--;
                $el.mode(false);
                if (settings.gallery === true) {
                    plugin.slideThumb();
                }
            } else {
                if (settings.loop === true) {
                    settings.onBeforePrevSlide.call(this, $el, scene);
                    if (settings.mode === 'fade') {
                        var l = (length - 1);
                        scene = parseInt(l / settings.slideMove);
                    }
                    $el.mode(false);
                    if (settings.gallery === true) {
                        plugin.slideThumb();
                    }
                } else if (settings.slideEndAnimatoin === true) {
                    $el.addClass('leftEnd');
                    setTimeout(function () {
                        $el.removeClass('leftEnd');
                    }, 400);
                }
            }
        };
        $el.goToNextSlide = function () {
            var nextI = true;
            if (settings.mode === 'slide') {
                var _slideValue = plugin.slideValue();
                var nextI = _slideValue < w - elSize - settings.slideMargin;
            }
            if (((scene * settings.slideMove) < length - settings.slideMove) && nextI) {
                settings.onBeforeNextSlide.call(this, $el, scene);
                scene++;
                $el.mode(false);
                if (settings.gallery === true) {
                    plugin.slideThumb();
                }
            } else {
                if (settings.loop === true) {
                    settings.onBeforeNextSlide.call(this, $el, scene);
                    scene = 0;
                    $el.mode(false);
                    if (settings.gallery === true) {
                        plugin.slideThumb();
                    }
                } else if (settings.slideEndAnimatoin === true) {
                    $el.addClass('rightEnd');
                    setTimeout(function () {
                        $el.removeClass('rightEnd');
                    }, 400);
                }
            }
        };
        $el.mode = function (_touch) {
            if (settings.adaptiveHeight === true && settings.vertical === false) {
                $el.css('height', $children.eq(scene).height());
            }
            if (on === false) {
                if (settings.mode === "slide") {
                    if (plugin.doCss()) {
                        $el.addClass('lSSlide');
                        if (settings.speed !== '') {
                            $slide.css('transition-duration', settings.speed + 'ms');
                        }
                        if (settings.cssEasing !== '') {
                            $slide.css('transition-timing-function', settings.cssEasing);
                        }
                    }
                } else {
                    if (plugin.doCss()) {
                        if (settings.speed !== '') {
                            $el.css('transition-duration', settings.speed + 'ms');
                        }
                        if (settings.cssEasing !== '') {
                            $el.css('transition-timing-function', settings.cssEasing);
                        }
                    }
                }
            }
            if (!_touch) {
                settings.onBeforeSlide.call(this, $el, scene);
            }
            if (settings.mode === "slide") {
                plugin.slide();
            } else {
                plugin.fade();
            }
            setTimeout(function () {
                if (!_touch) {
                    settings.onAfterSlide.call(this, $el, scene);
                }
            }, settings.speed);
            on = true;
        };
        $el.play = function () {
            clearInterval(interval);
            $el.goToNextSlide();
            interval = setInterval(function () {
                $el.goToNextSlide();
            }, settings.pause);
        };
        $el.pause = function () {
            clearInterval(interval);
        };
        $el.refresh = function () {
            refresh.init();
        };
        $el.getCurrentSlideCount = function () {
            var sc = scene;
            if (settings.loop) {
                var ln = $slide.find('.lslide').length,
                    cl = $el.find('.clone.left').length;
                if(scene<=cl-1){
                    sc = ln  + (scene-cl);
                }else if(scene >= (ln+cl)){
                    sc = scene - ln - cl;
                }else{
                    sc = scene - cl;
                }
            };
            return sc+1;
        };
        $el.getTotalSlideCount = function(){
            return $slide.find('.lslide').length;
        };
        $el.goToSlide = function (s) {
            if (settings.loop) {
                scene = (s + $el.find('.clone.left').length -1);
            }else{
                scene = s;
            }
            $el.mode(false);
            if (settings.gallery === true) {
                plugin.slideThumb();
            }
        };
        setTimeout(function(){
            settings.onSliderLoad.call(this, $el);
        },10);
        $(window).on('resize orientationchange', function (e) {
            setTimeout(function () {
                e.preventDefault();
                refresh.init();
            }, 200);
        });
        return this;
    };
    //SLIDE SIGNLE PRODUCT
    $(window).on('load', function(){
        $('#ts-lightSlider').lightSlider({
            gallery: true,
            item: 1,
            loop: true,
            slideMargin: 0,
            thumbItem: 3
        });
    });

}(jQuery));;
/* Modernizr 2.8.1 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-fontface-backgroundsize-borderimage-borderradius-boxshadow-flexbox-flexboxlegacy-hsla-multiplebgs-opacity-rgba-textshadow-cssanimations-csscolumns-generatedcontent-cssgradients-cssreflections-csstransforms-csstransforms3d-csstransitions-applicationcache-canvas-canvastext-draganddrop-hashchange-history-audio-video-indexeddb-input-inputtypes-localstorage-postmessage-sessionstorage-websockets-websqldatabase-webworkers-geolocation-inlinesvg-smil-svg-svgclippaths-touch-webgl-shiv-cssclasses-teststyles-testprop-testallprops-hasevent-prefixes-domprefixes-load
 */
;window.Modernizr=function(a,b,c){function C(a){j.cssText=a}function D(a,b){return C(n.join(a+";")+(b||""))}function E(a,b){return typeof a===b}function F(a,b){return!!~(""+a).indexOf(b)}function G(a,b){for(var d in a){var e=a[d];if(!F(e,"-")&&j[e]!==c)return b=="pfx"?e:!0}return!1}function H(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:E(f,"function")?f.bind(d||b):f}return!1}function I(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+p.join(d+" ")+d).split(" ");return E(b,"string")||E(b,"undefined")?G(e,b):(e=(a+" "+q.join(d+" ")+d).split(" "),H(e,b,c))}function J(){e.input=function(c){for(var d=0,e=c.length;d<e;d++)u[c[d]]=c[d]in k;return u.list&&(u.list=!!b.createElement("datalist")&&!!a.HTMLDataListElement),u}("autocomplete autofocus list placeholder max min multiple pattern required step".split(" ")),e.inputtypes=function(a){for(var d=0,e,f,h,i=a.length;d<i;d++)k.setAttribute("type",f=a[d]),e=k.type!=="text",e&&(k.value=l,k.style.cssText="position:absolute;visibility:hidden;",/^range$/.test(f)&&k.style.WebkitAppearance!==c?(g.appendChild(k),h=b.defaultView,e=h.getComputedStyle&&h.getComputedStyle(k,null).WebkitAppearance!=="textfield"&&k.offsetHeight!==0,g.removeChild(k)):/^(search|tel)$/.test(f)||(/^(url|email)$/.test(f)?e=k.checkValidity&&k.checkValidity()===!1:e=k.value!=l)),t[a[d]]=!!e;return t}("search tel url email datetime date month week time datetime-local number range color".split(" "))}var d="2.8.1",e={},f=!0,g=b.documentElement,h="modernizr",i=b.createElement(h),j=i.style,k=b.createElement("input"),l=":)",m={}.toString,n=" -webkit- -moz- -o- -ms- ".split(" "),o="Webkit Moz O ms",p=o.split(" "),q=o.toLowerCase().split(" "),r={svg:"http://www.w3.org/2000/svg"},s={},t={},u={},v=[],w=v.slice,x,y=function(a,c,d,e){var f,i,j,k,l=b.createElement("div"),m=b.body,n=m||b.createElement("body");if(parseInt(d,10))while(d--)j=b.createElement("div"),j.id=e?e[d]:h+(d+1),l.appendChild(j);return f=["&#173;",'<style id="s',h,'">',a,"</style>"].join(""),l.id=h,(m?l:n).innerHTML+=f,n.appendChild(l),m||(n.style.background="",n.style.overflow="hidden",k=g.style.overflow,g.style.overflow="hidden",g.appendChild(n)),i=c(l,a),m?l.parentNode.removeChild(l):(n.parentNode.removeChild(n),g.style.overflow=k),!!i},z=function(){function d(d,e){e=e||b.createElement(a[d]||"div"),d="on"+d;var f=d in e;return f||(e.setAttribute||(e=b.createElement("div")),e.setAttribute&&e.removeAttribute&&(e.setAttribute(d,""),f=E(e[d],"function"),E(e[d],"undefined")||(e[d]=c),e.removeAttribute(d))),e=null,f}var a={select:"input",change:"input",submit:"form",reset:"form",error:"img",load:"img",abort:"img"};return d}(),A={}.hasOwnProperty,B;!E(A,"undefined")&&!E(A.call,"undefined")?B=function(a,b){return A.call(a,b)}:B=function(a,b){return b in a&&E(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=w.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(w.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(w.call(arguments)))};return e}),s.flexbox=function(){return I("flexWrap")},s.flexboxlegacy=function(){return I("boxDirection")},s.canvas=function(){var a=b.createElement("canvas");return!!a.getContext&&!!a.getContext("2d")},s.canvastext=function(){return!!e.canvas&&!!E(b.createElement("canvas").getContext("2d").fillText,"function")},s.webgl=function(){return!!a.WebGLRenderingContext},s.touch=function(){var c;return"ontouchstart"in a||a.DocumentTouch&&b instanceof DocumentTouch?c=!0:y(["@media (",n.join("touch-enabled),("),h,")","{#modernizr{top:9px;position:absolute}}"].join(""),function(a){c=a.offsetTop===9}),c},s.geolocation=function(){return"geolocation"in navigator},s.postmessage=function(){return!!a.postMessage},s.websqldatabase=function(){return!!a.openDatabase},s.indexedDB=function(){return!!I("indexedDB",a)},s.hashchange=function(){return z("hashchange",a)&&(b.documentMode===c||b.documentMode>7)},s.history=function(){return!!a.history&&!!history.pushState},s.draganddrop=function(){var a=b.createElement("div");return"draggable"in a||"ondragstart"in a&&"ondrop"in a},s.websockets=function(){return"WebSocket"in a||"MozWebSocket"in a},s.rgba=function(){return C("background-color:rgba(150,255,150,.5)"),F(j.backgroundColor,"rgba")},s.hsla=function(){return C("background-color:hsla(120,40%,100%,.5)"),F(j.backgroundColor,"rgba")||F(j.backgroundColor,"hsla")},s.multiplebgs=function(){return C("background:url(https://),url(https://),red url(https://)"),/(url\s*\(.*?){3}/.test(j.background)},s.backgroundsize=function(){return I("backgroundSize")},s.borderimage=function(){return I("borderImage")},s.borderradius=function(){return I("borderRadius")},s.boxshadow=function(){return I("boxShadow")},s.textshadow=function(){return b.createElement("div").style.textShadow===""},s.opacity=function(){return D("opacity:.55"),/^0.55$/.test(j.opacity)},s.cssanimations=function(){return I("animationName")},s.csscolumns=function(){return I("columnCount")},s.cssgradients=function(){var a="background-image:",b="gradient(linear,left top,right bottom,from(#9f9),to(white));",c="linear-gradient(left top,#9f9, white);";return C((a+"-webkit- ".split(" ").join(b+a)+n.join(c+a)).slice(0,-a.length)),F(j.backgroundImage,"gradient")},s.cssreflections=function(){return I("boxReflect")},s.csstransforms=function(){return!!I("transform")},s.csstransforms3d=function(){var a=!!I("perspective");return a&&"webkitPerspective"in g.style&&y("@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}",function(b,c){a=b.offsetLeft===9&&b.offsetHeight===3}),a},s.csstransitions=function(){return I("transition")},s.fontface=function(){var a;return y('@font-face {font-family:"font";src:url("https://")}',function(c,d){var e=b.getElementById("smodernizr"),f=e.sheet||e.styleSheet,g=f?f.cssRules&&f.cssRules[0]?f.cssRules[0].cssText:f.cssText||"":"";a=/src/i.test(g)&&g.indexOf(d.split(" ")[0])===0}),a},s.generatedcontent=function(){var a;return y(["#",h,"{font:0/0 a}#",h,':after{content:"',l,'";visibility:hidden;font:3px/1 a}'].join(""),function(b){a=b.offsetHeight>=3}),a},s.video=function(){var a=b.createElement("video"),c=!1;try{if(c=!!a.canPlayType)c=new Boolean(c),c.ogg=a.canPlayType('video/ogg; codecs="theora"').replace(/^no$/,""),c.h264=a.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/,""),c.webm=a.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/,"")}catch(d){}return c},s.audio=function(){var a=b.createElement("audio"),c=!1;try{if(c=!!a.canPlayType)c=new Boolean(c),c.ogg=a.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,""),c.mp3=a.canPlayType("audio/mpeg;").replace(/^no$/,""),c.wav=a.canPlayType('audio/wav; codecs="1"').replace(/^no$/,""),c.m4a=(a.canPlayType("audio/x-m4a;")||a.canPlayType("audio/aac;")).replace(/^no$/,"")}catch(d){}return c},s.localstorage=function(){try{return localStorage.setItem(h,h),localStorage.removeItem(h),!0}catch(a){return!1}},s.sessionstorage=function(){try{return sessionStorage.setItem(h,h),sessionStorage.removeItem(h),!0}catch(a){return!1}},s.webworkers=function(){return!!a.Worker},s.applicationcache=function(){return!!a.applicationCache},s.svg=function(){return!!b.createElementNS&&!!b.createElementNS(r.svg,"svg").createSVGRect},s.inlinesvg=function(){var a=b.createElement("div");return a.innerHTML="<svg/>",(a.firstChild&&a.firstChild.namespaceURI)==r.svg},s.smil=function(){return!!b.createElementNS&&/SVGAnimate/.test(m.call(b.createElementNS(r.svg,"animate")))},s.svgclippaths=function(){return!!b.createElementNS&&/SVGClipPath/.test(m.call(b.createElementNS(r.svg,"clipPath")))};for(var K in s)B(s,K)&&(x=K.toLowerCase(),e[x]=s[K](),v.push((e[x]?"":"no-")+x));return e.input||J(),e.addTest=function(a,b){if(typeof a=="object")for(var d in a)B(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof f!="undefined"&&f&&(g.className+=" "+(b?"":"no-")+a),e[a]=b}return e},C(""),i=k=null,function(a,b){function l(a,b){var c=a.createElement("p"),d=a.getElementsByTagName("head")[0]||a.documentElement;return c.innerHTML="x<style>"+b+"</style>",d.insertBefore(c.lastChild,d.firstChild)}function m(){var a=s.elements;return typeof a=="string"?a.split(" "):a}function n(a){var b=j[a[h]];return b||(b={},i++,a[h]=i,j[i]=b),b}function o(a,c,d){c||(c=b);if(k)return c.createElement(a);d||(d=n(c));var g;return d.cache[a]?g=d.cache[a].cloneNode():f.test(a)?g=(d.cache[a]=d.createElem(a)).cloneNode():g=d.createElem(a),g.canHaveChildren&&!e.test(a)&&!g.tagUrn?d.frag.appendChild(g):g}function p(a,c){a||(a=b);if(k)return a.createDocumentFragment();c=c||n(a);var d=c.frag.cloneNode(),e=0,f=m(),g=f.length;for(;e<g;e++)d.createElement(f[e]);return d}function q(a,b){b.cache||(b.cache={},b.createElem=a.createElement,b.createFrag=a.createDocumentFragment,b.frag=b.createFrag()),a.createElement=function(c){return s.shivMethods?o(c,a,b):b.createElem(c)},a.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+m().join().replace(/[\w\-]+/g,function(a){return b.createElem(a),b.frag.createElement(a),'c("'+a+'")'})+");return n}")(s,b.frag)}function r(a){a||(a=b);var c=n(a);return s.shivCSS&&!g&&!c.hasCSS&&(c.hasCSS=!!l(a,"article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")),k||q(a,c),a}var c="3.7.0",d=a.html5||{},e=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,f=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,g,h="_html5shiv",i=0,j={},k;(function(){try{var a=b.createElement("a");a.innerHTML="<xyz></xyz>",g="hidden"in a,k=a.childNodes.length==1||function(){b.createElement("a");var a=b.createDocumentFragment();return typeof a.cloneNode=="undefined"||typeof a.createDocumentFragment=="undefined"||typeof a.createElement=="undefined"}()}catch(c){g=!0,k=!0}})();var s={elements:d.elements||"abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video",version:c,shivCSS:d.shivCSS!==!1,supportsUnknownElements:k,shivMethods:d.shivMethods!==!1,type:"default",shivDocument:r,createElement:o,createDocumentFragment:p};a.html5=s,r(b)}(this,b),e._version=d,e._prefixes=n,e._domPrefixes=q,e._cssomPrefixes=p,e.hasEvent=z,e.testProp=function(a){return G([a])},e.testAllProps=I,e.testStyles=y,g.className=g.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(f?" js "+v.join(" "):""),e}(this,this.document),function(a,b,c){function d(a){return"[object Function]"==o.call(a)}function e(a){return"string"==typeof a}function f(){}function g(a){return!a||"loaded"==a||"complete"==a||"uninitialized"==a}function h(){var a=p.shift();q=1,a?a.t?m(function(){("c"==a.t?B.injectCss:B.injectJs)(a.s,0,a.a,a.x,a.e,1)},0):(a(),h()):q=0}function i(a,c,d,e,f,i,j){function k(b){if(!o&&g(l.readyState)&&(u.r=o=1,!q&&h(),l.onload=l.onreadystatechange=null,b)){"img"!=a&&m(function(){t.removeChild(l)},50);for(var d in y[c])y[c].hasOwnProperty(d)&&y[c][d].onload()}}var j=j||B.errorTimeout,l=b.createElement(a),o=0,r=0,u={t:d,s:c,e:f,a:i,x:j};1===y[c]&&(r=1,y[c]=[]),"object"==a?l.data=c:(l.src=c,l.type=a),l.width=l.height="0",l.onerror=l.onload=l.onreadystatechange=function(){k.call(this,r)},p.splice(e,0,u),"img"!=a&&(r||2===y[c]?(t.insertBefore(l,s?null:n),m(k,j)):y[c].push(l))}function j(a,b,c,d,f){return q=0,b=b||"j",e(a)?i("c"==b?v:u,a,b,this.i++,c,d,f):(p.splice(this.i++,0,a),1==p.length&&h()),this}function k(){var a=B;return a.loader={load:j,i:0},a}var l=b.documentElement,m=a.setTimeout,n=b.getElementsByTagName("script")[0],o={}.toString,p=[],q=0,r="MozAppearance"in l.style,s=r&&!!b.createRange().compareNode,t=s?l:n.parentNode,l=a.opera&&"[object Opera]"==o.call(a.opera),l=!!b.attachEvent&&!l,u=r?"object":l?"script":"img",v=l?"script":u,w=Array.isArray||function(a){return"[object Array]"==o.call(a)},x=[],y={},z={timeout:function(a,b){return b.length&&(a.timeout=b[0]),a}},A,B;B=function(a){function b(a){var a=a.split("!"),b=x.length,c=a.pop(),d=a.length,c={url:c,origUrl:c,prefixes:a},e,f,g;for(f=0;f<d;f++)g=a[f].split("="),(e=z[g.shift()])&&(c=e(c,g));for(f=0;f<b;f++)c=x[f](c);return c}function g(a,e,f,g,h){var i=b(a),j=i.autoCallback;i.url.split(".").pop().split("?").shift(),i.bypass||(e&&(e=d(e)?e:e[a]||e[g]||e[a.split("/").pop().split("?")[0]]),i.instead?i.instead(a,e,f,g,h):(y[i.url]?i.noexec=!0:y[i.url]=1,f.load(i.url,i.forceCSS||!i.forceJS&&"css"==i.url.split(".").pop().split("?").shift()?"c":c,i.noexec,i.attrs,i.timeout),(d(e)||d(j))&&f.load(function(){k(),e&&e(i.origUrl,h,g),j&&j(i.origUrl,h,g),y[i.url]=2})))}function h(a,b){function c(a,c){if(a){if(e(a))c||(j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}),g(a,j,b,0,h);else if(Object(a)===a)for(n in m=function(){var b=0,c;for(c in a)a.hasOwnProperty(c)&&b++;return b}(),a)a.hasOwnProperty(n)&&(!c&&!--m&&(d(j)?j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}:j[n]=function(a){return function(){var b=[].slice.call(arguments);a&&a.apply(this,b),l()}}(k[n])),g(a[n],j,b,n,h))}else!c&&l()}var h=!!a.test,i=a.load||a.both,j=a.callback||f,k=j,l=a.complete||f,m,n;c(h?a.yep:a.nope,!!i),i&&c(i)}var i,j,l=this.yepnope.loader;if(e(a))g(a,0,l,0);else if(w(a))for(i=0;i<a.length;i++)j=a[i],e(j)?g(j,0,l,0):w(j)?B(j):Object(j)===j&&h(j,l);else Object(a)===a&&h(a,l)},B.addPrefix=function(a,b){z[a]=b},B.addFilter=function(a){x.push(a)},B.errorTimeout=1e4,null==b.readyState&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",A=function(){b.removeEventListener("DOMContentLoaded",A,0),b.readyState="complete"},0)),a.yepnope=k(),a.yepnope.executeStack=h,a.yepnope.injectJs=function(a,c,d,e,i,j){var k=b.createElement("script"),l,o,e=e||B.errorTimeout;k.src=a;for(o in d)k.setAttribute(o,d[o]);c=j?h:c||f,k.onreadystatechange=k.onload=function(){!l&&g(k.readyState)&&(l=1,c(),k.onload=k.onreadystatechange=null)},m(function(){l||(l=1,c(1))},e),i?k.onload():n.parentNode.insertBefore(k,n)},a.yepnope.injectCss=function(a,c,d,e,g,i){var e=b.createElement("link"),j,c=i?h:c||f;e.href=a,e.rel="stylesheet",e.type="text/css";for(j in d)e.setAttribute(j,d[j]);g||(n.parentNode.insertBefore(e,n),m(c,0))}}(this,document),Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0))};;
"function"!==typeof Object.create&&(Object.create=function(f){function g(){}g.prototype=f;return new g});
(function(f,g,k){var l={init:function(a,b){this.$elem=f(b);this.options=f.extend({},f.fn.owlCarousel.options,this.$elem.data(),a);this.userOptions=a;this.loadContent()},loadContent:function(){function a(a){var d,e="";if("function"===typeof b.options.jsonSuccess)b.options.jsonSuccess.apply(this,[a]);else{for(d in a.owl)a.owl.hasOwnProperty(d)&&(e+=a.owl[d].item);b.$elem.html(e)}b.logIn()}var b=this,e;"function"===typeof b.options.beforeInit&&b.options.beforeInit.apply(this,[b.$elem]);"string"===typeof b.options.jsonPath?
(e=b.options.jsonPath,f.getJSON(e,a)):b.logIn()},logIn:function(){this.$elem.data("owl-originalStyles",this.$elem.attr("style"));this.$elem.data("owl-originalClasses",this.$elem.attr("class"));this.$elem.css({opacity:0});this.orignalItems=this.options.items;this.checkBrowser();this.wrapperWidth=0;this.checkVisible=null;this.setVars()},setVars:function(){if(0===this.$elem.children().length)return!1;this.baseClass();this.eventTypes();this.$userItems=this.$elem.children();this.itemsAmount=this.$userItems.length;
this.wrapItems();this.$owlItems=this.$elem.find(".owl-item");this.$owlWrapper=this.$elem.find(".owl-wrapper");this.playDirection="next";this.prevItem=0;this.prevArr=[0];this.currentItem=0;this.customEvents();this.onStartup()},onStartup:function(){this.updateItems();this.calculateAll();this.buildControls();this.updateControls();this.response();this.moveEvents();this.stopOnHover();this.owlStatus();!1!==this.options.transitionStyle&&this.transitionTypes(this.options.transitionStyle);!0===this.options.autoPlay&&
(this.options.autoPlay=5E3);this.play();this.$elem.find(".owl-wrapper").css("display","block");this.$elem.is(":visible")?this.$elem.css("opacity",1):this.watchVisibility();this.onstartup=!1;this.eachMoveUpdate();"function"===typeof this.options.afterInit&&this.options.afterInit.apply(this,[this.$elem])},eachMoveUpdate:function(){!0===this.options.lazyLoad&&this.lazyLoad();!0===this.options.autoHeight&&this.autoHeight();this.onVisibleItems();"function"===typeof this.options.afterAction&&this.options.afterAction.apply(this,
[this.$elem])},updateVars:function(){"function"===typeof this.options.beforeUpdate&&this.options.beforeUpdate.apply(this,[this.$elem]);this.watchVisibility();this.updateItems();this.calculateAll();this.updatePosition();this.updateControls();this.eachMoveUpdate();"function"===typeof this.options.afterUpdate&&this.options.afterUpdate.apply(this,[this.$elem])},reload:function(){var a=this;g.setTimeout(function(){a.updateVars()},0)},watchVisibility:function(){var a=this;if(!1===a.$elem.is(":visible"))a.$elem.css({opacity:0}),
g.clearInterval(a.autoPlayInterval),g.clearInterval(a.checkVisible);else return!1;a.checkVisible=g.setInterval(function(){a.$elem.is(":visible")&&(a.reload(),a.$elem.animate({opacity:1},200),g.clearInterval(a.checkVisible))},500)},wrapItems:function(){this.$userItems.wrapAll('<div class="owl-wrapper">').wrap('<div class="owl-item"></div>');this.$elem.find(".owl-wrapper").wrap('<div class="owl-wrapper-outer">');this.wrapperOuter=this.$elem.find(".owl-wrapper-outer");this.$elem.css("display","block")},
baseClass:function(){var a=this.$elem.hasClass(this.options.baseClass),b=this.$elem.hasClass(this.options.theme);a||this.$elem.addClass(this.options.baseClass);b||this.$elem.addClass(this.options.theme)},updateItems:function(){var a,b;if(!1===this.options.responsive)return!1;if(!0===this.options.singleItem)return this.options.items=this.orignalItems=1,this.options.itemsCustom=!1,this.options.itemsDesktop=!1,this.options.itemsDesktopSmall=!1,this.options.itemsTablet=!1,this.options.itemsTabletSmall=
!1,this.options.itemsMobile=!1;a=f(this.options.responsiveBaseWidth).width();a>(this.options.itemsDesktop[0]||this.orignalItems)&&(this.options.items=this.orignalItems);if(!1!==this.options.itemsCustom)for(this.options.itemsCustom.sort(function(a,b){return a[0]-b[0]}),b=0;b<this.options.itemsCustom.length;b+=1)this.options.itemsCustom[b][0]<=a&&(this.options.items=this.options.itemsCustom[b][1]);else a<=this.options.itemsDesktop[0]&&!1!==this.options.itemsDesktop&&(this.options.items=this.options.itemsDesktop[1]),
a<=this.options.itemsDesktopSmall[0]&&!1!==this.options.itemsDesktopSmall&&(this.options.items=this.options.itemsDesktopSmall[1]),a<=this.options.itemsTablet[0]&&!1!==this.options.itemsTablet&&(this.options.items=this.options.itemsTablet[1]),a<=this.options.itemsTabletSmall[0]&&!1!==this.options.itemsTabletSmall&&(this.options.items=this.options.itemsTabletSmall[1]),a<=this.options.itemsMobile[0]&&!1!==this.options.itemsMobile&&(this.options.items=this.options.itemsMobile[1]);this.options.items>this.itemsAmount&&
!0===this.options.itemsScaleUp&&(this.options.items=this.itemsAmount)},response:function(){var a=this,b,e;if(!0!==a.options.responsive)return!1;e=f(g).width();a.resizer=function(){f(g).width()!==e&&(!1!==a.options.autoPlay&&g.clearInterval(a.autoPlayInterval),g.clearTimeout(b),b=g.setTimeout(function(){e=f(g).width();a.updateVars()},a.options.responsiveRefreshRate))};f(g).resize(a.resizer)},updatePosition:function(){this.jumpTo(this.currentItem);!1!==this.options.autoPlay&&this.checkAp()},appendItemsSizes:function(){var a=
this,b=0,e=a.itemsAmount-a.options.items;a.$owlItems.each(function(c){var d=f(this);d.css({width:a.itemWidth}).data("owl-item",Number(c));if(0===c%a.options.items||c===e)c>e||(b+=1);d.data("owl-roundPages",b)})},appendWrapperSizes:function(){this.$owlWrapper.css({width:this.$owlItems.length*this.itemWidth*2,left:0});this.appendItemsSizes()},calculateAll:function(){this.calculateWidth();this.appendWrapperSizes();this.loops();this.max()},calculateWidth:function(){this.itemWidth=Math.round(this.$elem.width()/
this.options.items)},max:function(){var a=-1*(this.itemsAmount*this.itemWidth-this.options.items*this.itemWidth);this.options.items>this.itemsAmount?this.maximumPixels=a=this.maximumItem=0:(this.maximumItem=this.itemsAmount-this.options.items,this.maximumPixels=a);return a},min:function(){return 0},loops:function(){var a=0,b=0,e,c;this.positionsInArray=[0];this.pagesInArray=[];for(e=0;e<this.itemsAmount;e+=1)b+=this.itemWidth,this.positionsInArray.push(-b),!0===this.options.scrollPerPage&&(c=f(this.$owlItems[e]),
c=c.data("owl-roundPages"),c!==a&&(this.pagesInArray[a]=this.positionsInArray[e],a=c))},buildControls:function(){if(!0===this.options.navigation||!0===this.options.pagination)this.owlControls=f('<div class="owl-controls"/>').toggleClass("clickable",!this.browser.isTouch).appendTo(this.$elem);!0===this.options.pagination&&this.buildPagination();!0===this.options.navigation&&this.buildButtons()},buildButtons:function(){var a=this,b=f('<div class="owl-buttons"/>');a.owlControls.append(b);a.buttonPrev=
f("<div/>",{"class":"owl-prev",html:a.options.navigationText[0]||""});a.buttonNext=f("<div/>",{"class":"owl-next",html:a.options.navigationText[1]||""});b.append(a.buttonPrev).append(a.buttonNext);b.on("touchstart.owlControls mousedown.owlControls",'div[class^="owl"]',function(a){a.preventDefault()});b.on("touchend.owlControls mouseup.owlControls",'div[class^="owl"]',function(b){b.preventDefault();f(this).hasClass("owl-next")?a.next():a.prev()})},buildPagination:function(){var a=this;a.paginationWrapper=
f('<div class="owl-pagination"/>');a.owlControls.append(a.paginationWrapper);a.paginationWrapper.on("touchend.owlControls mouseup.owlControls",".owl-page",function(b){b.preventDefault();Number(f(this).data("owl-page"))!==a.currentItem&&a.goTo(Number(f(this).data("owl-page")),!0)})},updatePagination:function(){var a,b,e,c,d,g;if(!1===this.options.pagination)return!1;this.paginationWrapper.html("");a=0;b=this.itemsAmount-this.itemsAmount%this.options.items;for(c=0;c<this.itemsAmount;c+=1)0===c%this.options.items&&
(a+=1,b===c&&(e=this.itemsAmount-this.options.items),d=f("<div/>",{"class":"owl-page"}),g=f("<span></span>",{text:!0===this.options.paginationNumbers?a:"","class":!0===this.options.paginationNumbers?"owl-numbers":""}),d.append(g),d.data("owl-page",b===c?e:c),d.data("owl-roundPages",a),this.paginationWrapper.append(d));this.checkPagination()},checkPagination:function(){var a=this;if(!1===a.options.pagination)return!1;a.paginationWrapper.find(".owl-page").each(function(){f(this).data("owl-roundPages")===
f(a.$owlItems[a.currentItem]).data("owl-roundPages")&&(a.paginationWrapper.find(".owl-page").removeClass("active"),f(this).addClass("active"))})},checkNavigation:function(){if(!1===this.options.navigation)return!1;!1===this.options.rewindNav&&(0===this.currentItem&&0===this.maximumItem?(this.buttonPrev.addClass("disabled"),this.buttonNext.addClass("disabled")):0===this.currentItem&&0!==this.maximumItem?(this.buttonPrev.addClass("disabled"),this.buttonNext.removeClass("disabled")):this.currentItem===
this.maximumItem?(this.buttonPrev.removeClass("disabled"),this.buttonNext.addClass("disabled")):0!==this.currentItem&&this.currentItem!==this.maximumItem&&(this.buttonPrev.removeClass("disabled"),this.buttonNext.removeClass("disabled")))},updateControls:function(){this.updatePagination();this.checkNavigation();this.owlControls&&(this.options.items>=this.itemsAmount?this.owlControls.hide():this.owlControls.show())},destroyControls:function(){this.owlControls&&this.owlControls.remove()},next:function(a){if(this.isTransition)return!1;
this.currentItem+=!0===this.options.scrollPerPage?this.options.items:1;if(this.currentItem>this.maximumItem+(!0===this.options.scrollPerPage?this.options.items-1:0))if(!0===this.options.rewindNav)this.currentItem=0,a="rewind";else return this.currentItem=this.maximumItem,!1;this.goTo(this.currentItem,a)},prev:function(a){if(this.isTransition)return!1;this.currentItem=!0===this.options.scrollPerPage&&0<this.currentItem&&this.currentItem<this.options.items?0:this.currentItem-(!0===this.options.scrollPerPage?
this.options.items:1);if(0>this.currentItem)if(!0===this.options.rewindNav)this.currentItem=this.maximumItem,a="rewind";else return this.currentItem=0,!1;this.goTo(this.currentItem,a)},goTo:function(a,b,e){var c=this;if(c.isTransition)return!1;"function"===typeof c.options.beforeMove&&c.options.beforeMove.apply(this,[c.$elem]);a>=c.maximumItem?a=c.maximumItem:0>=a&&(a=0);c.currentItem=c.owl.currentItem=a;if(!1!==c.options.transitionStyle&&"drag"!==e&&1===c.options.items&&!0===c.browser.support3d)return c.swapSpeed(0),
!0===c.browser.support3d?c.transition3d(c.positionsInArray[a]):c.css2slide(c.positionsInArray[a],1),c.afterGo(),c.singleItemTransition(),!1;a=c.positionsInArray[a];!0===c.browser.support3d?(c.isCss3Finish=!1,!0===b?(c.swapSpeed("paginationSpeed"),g.setTimeout(function(){c.isCss3Finish=!0},c.options.paginationSpeed)):"rewind"===b?(c.swapSpeed(c.options.rewindSpeed),g.setTimeout(function(){c.isCss3Finish=!0},c.options.rewindSpeed)):(c.swapSpeed("slideSpeed"),g.setTimeout(function(){c.isCss3Finish=!0},
c.options.slideSpeed)),c.transition3d(a)):!0===b?c.css2slide(a,c.options.paginationSpeed):"rewind"===b?c.css2slide(a,c.options.rewindSpeed):c.css2slide(a,c.options.slideSpeed);c.afterGo()},jumpTo:function(a){"function"===typeof this.options.beforeMove&&this.options.beforeMove.apply(this,[this.$elem]);a>=this.maximumItem||-1===a?a=this.maximumItem:0>=a&&(a=0);this.swapSpeed(0);!0===this.browser.support3d?this.transition3d(this.positionsInArray[a]):this.css2slide(this.positionsInArray[a],1);this.currentItem=
this.owl.currentItem=a;this.afterGo()},afterGo:function(){this.prevArr.push(this.currentItem);this.prevItem=this.owl.prevItem=this.prevArr[this.prevArr.length-2];this.prevArr.shift(0);this.prevItem!==this.currentItem&&(this.checkPagination(),this.checkNavigation(),this.eachMoveUpdate(),!1!==this.options.autoPlay&&this.checkAp());"function"===typeof this.options.afterMove&&this.prevItem!==this.currentItem&&this.options.afterMove.apply(this,[this.$elem])},stop:function(){this.apStatus="stop";g.clearInterval(this.autoPlayInterval)},
checkAp:function(){"stop"!==this.apStatus&&this.play()},play:function(){var a=this;a.apStatus="play";if(!1===a.options.autoPlay)return!1;g.clearInterval(a.autoPlayInterval);a.autoPlayInterval=g.setInterval(function(){a.next(!0)},a.options.autoPlay)},swapSpeed:function(a){"slideSpeed"===a?this.$owlWrapper.css(this.addCssSpeed(this.options.slideSpeed)):"paginationSpeed"===a?this.$owlWrapper.css(this.addCssSpeed(this.options.paginationSpeed)):"string"!==typeof a&&this.$owlWrapper.css(this.addCssSpeed(a))},
addCssSpeed:function(a){return{"-webkit-transition":"all "+a+"ms ease","-moz-transition":"all "+a+"ms ease","-o-transition":"all "+a+"ms ease",transition:"all "+a+"ms ease"}},removeTransition:function(){return{"-webkit-transition":"","-moz-transition":"","-o-transition":"",transition:""}},doTranslate:function(a){return{"-webkit-transform":"translate3d("+a+"px, 0px, 0px)","-moz-transform":"translate3d("+a+"px, 0px, 0px)","-o-transform":"translate3d("+a+"px, 0px, 0px)","-ms-transform":"translate3d("+
a+"px, 0px, 0px)",transform:"translate3d("+a+"px, 0px,0px)"}},transition3d:function(a){this.$owlWrapper.css(this.doTranslate(a))},css2move:function(a){this.$owlWrapper.css({left:a})},css2slide:function(a,b){var e=this;e.isCssFinish=!1;e.$owlWrapper.stop(!0,!0).animate({left:a},{duration:b||e.options.slideSpeed,complete:function(){e.isCssFinish=!0}})},checkBrowser:function(){var a=k.createElement("div");a.style.cssText="  -moz-transform:translate3d(0px, 0px, 0px); -ms-transform:translate3d(0px, 0px, 0px); -o-transform:translate3d(0px, 0px, 0px); -webkit-transform:translate3d(0px, 0px, 0px); transform:translate3d(0px, 0px, 0px)";
a=a.style.cssText.match(/translate3d\(0px, 0px, 0px\)/g);this.browser={support3d:null!==a&&1===a.length,isTouch:"ontouchstart"in g||g.navigator.msMaxTouchPoints}},moveEvents:function(){if(!1!==this.options.mouseDrag||!1!==this.options.touchDrag)this.gestures(),this.disabledEvents()},eventTypes:function(){var a=["s","e","x"];this.ev_types={};!0===this.options.mouseDrag&&!0===this.options.touchDrag?a=["touchstart.owl mousedown.owl","touchmove.owl mousemove.owl","touchend.owl touchcancel.owl mouseup.owl"]:
!1===this.options.mouseDrag&&!0===this.options.touchDrag?a=["touchstart.owl","touchmove.owl","touchend.owl touchcancel.owl"]:!0===this.options.mouseDrag&&!1===this.options.touchDrag&&(a=["mousedown.owl","mousemove.owl","mouseup.owl"]);this.ev_types.start=a[0];this.ev_types.move=a[1];this.ev_types.end=a[2]},disabledEvents:function(){this.$elem.on("dragstart.owl",function(a){a.preventDefault()});this.$elem.on("mousedown.disableTextSelect",function(a){return f(a.target).is("input, textarea, select, option")})},
gestures:function(){function a(a){if(void 0!==a.touches)return{x:a.touches[0].pageX,y:a.touches[0].pageY};if(void 0===a.touches){if(void 0!==a.pageX)return{x:a.pageX,y:a.pageY};if(void 0===a.pageX)return{x:a.clientX,y:a.clientY}}}function b(a){"on"===a?(f(k).on(d.ev_types.move,e),f(k).on(d.ev_types.end,c)):"off"===a&&(f(k).off(d.ev_types.move),f(k).off(d.ev_types.end))}function e(b){b=b.originalEvent||b||g.event;d.newPosX=a(b).x-h.offsetX;d.newPosY=a(b).y-h.offsetY;d.newRelativeX=d.newPosX-h.relativePos;
"function"===typeof d.options.startDragging&&!0!==h.dragging&&0!==d.newRelativeX&&(h.dragging=!0,d.options.startDragging.apply(d,[d.$elem]));(8<d.newRelativeX||-8>d.newRelativeX)&&!0===d.browser.isTouch&&(void 0!==b.preventDefault?b.preventDefault():b.returnValue=!1,h.sliding=!0);(10<d.newPosY||-10>d.newPosY)&&!1===h.sliding&&f(k).off("touchmove.owl");d.newPosX=Math.max(Math.min(d.newPosX,d.newRelativeX/5),d.maximumPixels+d.newRelativeX/5);!0===d.browser.support3d?d.transition3d(d.newPosX):d.css2move(d.newPosX)}
function c(a){a=a.originalEvent||a||g.event;var c;a.target=a.target||a.srcElement;h.dragging=!1;!0!==d.browser.isTouch&&d.$owlWrapper.removeClass("grabbing");d.dragDirection=0>d.newRelativeX?d.owl.dragDirection="left":d.owl.dragDirection="right";0!==d.newRelativeX&&(c=d.getNewPosition(),d.goTo(c,!1,"drag"),h.targetElement===a.target&&!0!==d.browser.isTouch&&(f(a.target).on("click.disable",function(a){a.stopImmediatePropagation();a.stopPropagation();a.preventDefault();f(a.target).off("click.disable")}),
a=f._data(a.target,"events").click,c=a.pop(),a.splice(0,0,c)));b("off")}var d=this,h={offsetX:0,offsetY:0,baseElWidth:0,relativePos:0,position:null,minSwipe:null,maxSwipe:null,sliding:null,dargging:null,targetElement:null};d.isCssFinish=!0;d.$elem.on(d.ev_types.start,".owl-wrapper",function(c){c=c.originalEvent||c||g.event;var e;if(3===c.which)return!1;if(!(d.itemsAmount<=d.options.items)){if(!1===d.isCssFinish&&!d.options.dragBeforeAnimFinish||!1===d.isCss3Finish&&!d.options.dragBeforeAnimFinish)return!1;
!1!==d.options.autoPlay&&g.clearInterval(d.autoPlayInterval);!0===d.browser.isTouch||d.$owlWrapper.hasClass("grabbing")||d.$owlWrapper.addClass("grabbing");d.newPosX=0;d.newRelativeX=0;f(this).css(d.removeTransition());e=f(this).position();h.relativePos=e.left;h.offsetX=a(c).x-e.left;h.offsetY=a(c).y-e.top;b("on");h.sliding=!1;h.targetElement=c.target||c.srcElement}})},getNewPosition:function(){var a=this.closestItem();a>this.maximumItem?a=this.currentItem=this.maximumItem:0<=this.newPosX&&(this.currentItem=
a=0);return a},closestItem:function(){var a=this,b=!0===a.options.scrollPerPage?a.pagesInArray:a.positionsInArray,e=a.newPosX,c=null;f.each(b,function(d,g){e-a.itemWidth/20>b[d+1]&&e-a.itemWidth/20<g&&"left"===a.moveDirection()?(c=g,a.currentItem=!0===a.options.scrollPerPage?f.inArray(c,a.positionsInArray):d):e+a.itemWidth/20<g&&e+a.itemWidth/20>(b[d+1]||b[d]-a.itemWidth)&&"right"===a.moveDirection()&&(!0===a.options.scrollPerPage?(c=b[d+1]||b[b.length-1],a.currentItem=f.inArray(c,a.positionsInArray)):
(c=b[d+1],a.currentItem=d+1))});return a.currentItem},moveDirection:function(){var a;0>this.newRelativeX?(a="right",this.playDirection="next"):(a="left",this.playDirection="prev");return a},customEvents:function(){var a=this;a.$elem.on("owl.next",function(){a.next()});a.$elem.on("owl.prev",function(){a.prev()});a.$elem.on("owl.play",function(b,e){a.options.autoPlay=e;a.play();a.hoverStatus="play"});a.$elem.on("owl.stop",function(){a.stop();a.hoverStatus="stop"});a.$elem.on("owl.goTo",function(b,e){a.goTo(e)});
a.$elem.on("owl.jumpTo",function(b,e){a.jumpTo(e)})},stopOnHover:function(){var a=this;!0===a.options.stopOnHover&&!0!==a.browser.isTouch&&!1!==a.options.autoPlay&&(a.$elem.on("mouseover",function(){a.stop()}),a.$elem.on("mouseout",function(){"stop"!==a.hoverStatus&&a.play()}))},lazyLoad:function(){var a,b,e,c,d;if(!1===this.options.lazyLoad)return!1;for(a=0;a<this.itemsAmount;a+=1)b=f(this.$owlItems[a]),"loaded"!==b.data("owl-loaded")&&(e=b.data("owl-item"),c=b.find(".lazyOwl"),"string"!==typeof c.data("src")?
b.data("owl-loaded","loaded"):(void 0===b.data("owl-loaded")&&(c.hide(),b.addClass("loading").data("owl-loaded","checked")),(d=!0===this.options.lazyFollow?e>=this.currentItem:!0)&&e<this.currentItem+this.options.items&&c.length&&this.lazyPreload(b,c)))},lazyPreload:function(a,b){function e(){a.data("owl-loaded","loaded").removeClass("loading");b.removeAttr("data-src");"fade"===d.options.lazyEffect?b.fadeIn(400):b.show();"function"===typeof d.options.afterLazyLoad&&d.options.afterLazyLoad.apply(this,
[d.$elem])}function c(){f+=1;d.completeImg(b.get(0))||!0===k?e():100>=f?g.setTimeout(c,100):e()}var d=this,f=0,k;"DIV"===b.prop("tagName")?(b.css("background-image","url("+b.data("src")+")"),k=!0):b[0].src=b.data("src");c()},autoHeight:function(){function a(){var a=f(e.$owlItems[e.currentItem]).height();e.wrapperOuter.css("height",a+"px");e.wrapperOuter.hasClass("autoHeight")||g.setTimeout(function(){e.wrapperOuter.addClass("autoHeight")},0)}function b(){d+=1;e.completeImg(c.get(0))?a():100>=d?g.setTimeout(b,
100):e.wrapperOuter.css("height","")}var e=this,c=f(e.$owlItems[e.currentItem]).find("img"),d;void 0!==c.get(0)?(d=0,b()):a()},completeImg:function(a){return!a.complete||"undefined"!==typeof a.naturalWidth&&0===a.naturalWidth?!1:!0},onVisibleItems:function(){var a;!0===this.options.addClassActive&&this.$owlItems.removeClass("active");this.visibleItems=[];for(a=this.currentItem;a<this.currentItem+this.options.items;a+=1)this.visibleItems.push(a),!0===this.options.addClassActive&&f(this.$owlItems[a]).addClass("active");
this.owl.visibleItems=this.visibleItems},transitionTypes:function(a){this.outClass="owl-"+a+"-out";this.inClass="owl-"+a+"-in"},singleItemTransition:function(){var a=this,b=a.outClass,e=a.inClass,c=a.$owlItems.eq(a.currentItem),d=a.$owlItems.eq(a.prevItem),f=Math.abs(a.positionsInArray[a.currentItem])+a.positionsInArray[a.prevItem],g=Math.abs(a.positionsInArray[a.currentItem])+a.itemWidth/2;a.isTransition=!0;a.$owlWrapper.addClass("owl-origin").css({"-webkit-transform-origin":g+"px","-moz-perspective-origin":g+
"px","perspective-origin":g+"px"});d.css({position:"relative",left:f+"px"}).addClass(b).on("webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend",function(){a.endPrev=!0;d.off("webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend");a.clearTransStyle(d,b)});c.addClass(e).on("webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend",function(){a.endCurrent=!0;c.off("webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend");a.clearTransStyle(c,e)})},clearTransStyle:function(a,
b){a.css({position:"",left:""}).removeClass(b);this.endPrev&&this.endCurrent&&(this.$owlWrapper.removeClass("owl-origin"),this.isTransition=this.endCurrent=this.endPrev=!1)},owlStatus:function(){this.owl={userOptions:this.userOptions,baseElement:this.$elem,userItems:this.$userItems,owlItems:this.$owlItems,currentItem:this.currentItem,prevItem:this.prevItem,visibleItems:this.visibleItems,isTouch:this.browser.isTouch,browser:this.browser,dragDirection:this.dragDirection}},clearEvents:function(){this.$elem.off(".owl owl mousedown.disableTextSelect");
f(k).off(".owl owl");f(g).off("resize",this.resizer)},unWrap:function(){0!==this.$elem.children().length&&(this.$owlWrapper.unwrap(),this.$userItems.unwrap().unwrap(),this.owlControls&&this.owlControls.remove());this.clearEvents();this.$elem.attr("style",this.$elem.data("owl-originalStyles")||"").attr("class",this.$elem.data("owl-originalClasses"))},destroy:function(){this.stop();g.clearInterval(this.checkVisible);this.unWrap();this.$elem.removeData()},reinit:function(a){a=f.extend({},this.userOptions,
a);this.unWrap();this.init(a,this.$elem)},addItem:function(a,b){var e;if(!a)return!1;if(0===this.$elem.children().length)return this.$elem.append(a),this.setVars(),!1;this.unWrap();e=void 0===b||-1===b?-1:b;e>=this.$userItems.length||-1===e?this.$userItems.eq(-1).after(a):this.$userItems.eq(e).before(a);this.setVars()},removeItem:function(a){if(0===this.$elem.children().length)return!1;a=void 0===a||-1===a?-1:a;this.unWrap();this.$userItems.eq(a).remove();this.setVars()}};f.fn.owlCarousel=function(a){return this.each(function(){if(!0===
f(this).data("owl-init"))return!1;f(this).data("owl-init",!0);var b=Object.create(l);b.init(a,this);f.data(this,"owlCarousel",b)})};f.fn.owlCarousel.options={items:5,itemsCustom:!1,itemsDesktop:[1199,4],itemsDesktopSmall:[979,3],itemsTablet:[768,2],itemsTabletSmall:!1,itemsMobile:[479,1],singleItem:!1,itemsScaleUp:!1,slideSpeed:200,paginationSpeed:800,rewindSpeed:1E3,autoPlay:!1,stopOnHover:!1,navigation:!1,navigationText:["prev","next"],rewindNav:!0,scrollPerPage:!1,pagination:!0,paginationNumbers:!1,
responsive:!0,responsiveRefreshRate:200,responsiveBaseWidth:g,baseClass:"owl-carousel",theme:"owl-theme",lazyLoad:!1,lazyFollow:!0,lazyEffect:"fade",autoHeight:!1,jsonPath:!1,jsonSuccess:!1,dragBeforeAnimFinish:!0,mouseDrag:!0,touchDrag:!0,addClassActive:!1,transitionStyle:!1,beforeUpdate:!1,afterUpdate:!1,beforeInit:!1,afterInit:!1,beforeMove:!1,afterMove:!1,afterAction:!1,startDragging:!1,afterLazyLoad:!1}})(jQuery,window,document);;
/*
Copyright 2012 Igor Vaynberg

Version: 3.5.2 Timestamp: Sat Nov  1 14:43:36 EDT 2014

This software is licensed under the Apache License, Version 2.0 (the "Apache License") or the GNU
General Public License version 2 (the "GPL License"). You may choose either license to govern your
use of this software only upon the condition that you accept all of the terms of either the Apache
License or the GPL License.

You may obtain a copy of the Apache License and the GPL License at:

    http://www.apache.org/licenses/LICENSE-2.0
    http://www.gnu.org/licenses/gpl-2.0.html

Unless required by applicable law or agreed to in writing, software distributed under the
Apache License or the GPL License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
CONDITIONS OF ANY KIND, either express or implied. See the Apache License and the GPL License for
the specific language governing permissions and limitations under the Apache License and the GPL License.
*/
(function ($) {
    if(typeof $.fn.each2 == "undefined") {
        $.extend($.fn, {
            /*
            * 4-10 times faster .each replacement
            * use it carefully, as it overrides jQuery context of element on each iteration
            */
            each2 : function (c) {
                var j = $([0]), i = -1, l = this.length;
                while (
                    ++i < l
                    && (j.context = j[0] = this[i])
                    && c.call(j[0], i, j) !== false //"this"=DOM, i=index, j=jQuery object
                );
                return this;
            }
        });
    }
})(jQuery);

(function ($, undefined) {
    "use strict";
    /*global document, window, jQuery, console */

    if (window.Select2 !== undefined) {
        return;
    }

    var AbstractSelect2, SingleSelect2, MultiSelect2, nextUid, sizer,
        lastMousePosition={x:0,y:0}, $document, scrollBarDimensions,

    KEY = {
        TAB: 9,
        ENTER: 13,
        ESC: 27,
        SPACE: 32,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        SHIFT: 16,
        CTRL: 17,
        ALT: 18,
        PAGE_UP: 33,
        PAGE_DOWN: 34,
        HOME: 36,
        END: 35,
        BACKSPACE: 8,
        DELETE: 46,
        isArrow: function (k) {
            k = k.which ? k.which : k;
            switch (k) {
            case KEY.LEFT:
            case KEY.RIGHT:
            case KEY.UP:
            case KEY.DOWN:
                return true;
            }
            return false;
        },
        isControl: function (e) {
            var k = e.which;
            switch (k) {
            case KEY.SHIFT:
            case KEY.CTRL:
            case KEY.ALT:
                return true;
            }

            if (e.metaKey) return true;

            return false;
        },
        isFunctionKey: function (k) {
            k = k.which ? k.which : k;
            return k >= 112 && k <= 123;
        }
    },
    MEASURE_SCROLLBAR_TEMPLATE = "<div class='select2-measure-scrollbar'></div>",

    DIACRITICS = {"\u24B6":"A","\uFF21":"A","\u00C0":"A","\u00C1":"A","\u00C2":"A","\u1EA6":"A","\u1EA4":"A","\u1EAA":"A","\u1EA8":"A","\u00C3":"A","\u0100":"A","\u0102":"A","\u1EB0":"A","\u1EAE":"A","\u1EB4":"A","\u1EB2":"A","\u0226":"A","\u01E0":"A","\u00C4":"A","\u01DE":"A","\u1EA2":"A","\u00C5":"A","\u01FA":"A","\u01CD":"A","\u0200":"A","\u0202":"A","\u1EA0":"A","\u1EAC":"A","\u1EB6":"A","\u1E00":"A","\u0104":"A","\u023A":"A","\u2C6F":"A","\uA732":"AA","\u00C6":"AE","\u01FC":"AE","\u01E2":"AE","\uA734":"AO","\uA736":"AU","\uA738":"AV","\uA73A":"AV","\uA73C":"AY","\u24B7":"B","\uFF22":"B","\u1E02":"B","\u1E04":"B","\u1E06":"B","\u0243":"B","\u0182":"B","\u0181":"B","\u24B8":"C","\uFF23":"C","\u0106":"C","\u0108":"C","\u010A":"C","\u010C":"C","\u00C7":"C","\u1E08":"C","\u0187":"C","\u023B":"C","\uA73E":"C","\u24B9":"D","\uFF24":"D","\u1E0A":"D","\u010E":"D","\u1E0C":"D","\u1E10":"D","\u1E12":"D","\u1E0E":"D","\u0110":"D","\u018B":"D","\u018A":"D","\u0189":"D","\uA779":"D","\u01F1":"DZ","\u01C4":"DZ","\u01F2":"Dz","\u01C5":"Dz","\u24BA":"E","\uFF25":"E","\u00C8":"E","\u00C9":"E","\u00CA":"E","\u1EC0":"E","\u1EBE":"E","\u1EC4":"E","\u1EC2":"E","\u1EBC":"E","\u0112":"E","\u1E14":"E","\u1E16":"E","\u0114":"E","\u0116":"E","\u00CB":"E","\u1EBA":"E","\u011A":"E","\u0204":"E","\u0206":"E","\u1EB8":"E","\u1EC6":"E","\u0228":"E","\u1E1C":"E","\u0118":"E","\u1E18":"E","\u1E1A":"E","\u0190":"E","\u018E":"E","\u24BB":"F","\uFF26":"F","\u1E1E":"F","\u0191":"F","\uA77B":"F","\u24BC":"G","\uFF27":"G","\u01F4":"G","\u011C":"G","\u1E20":"G","\u011E":"G","\u0120":"G","\u01E6":"G","\u0122":"G","\u01E4":"G","\u0193":"G","\uA7A0":"G","\uA77D":"G","\uA77E":"G","\u24BD":"H","\uFF28":"H","\u0124":"H","\u1E22":"H","\u1E26":"H","\u021E":"H","\u1E24":"H","\u1E28":"H","\u1E2A":"H","\u0126":"H","\u2C67":"H","\u2C75":"H","\uA78D":"H","\u24BE":"I","\uFF29":"I","\u00CC":"I","\u00CD":"I","\u00CE":"I","\u0128":"I","\u012A":"I","\u012C":"I","\u0130":"I","\u00CF":"I","\u1E2E":"I","\u1EC8":"I","\u01CF":"I","\u0208":"I","\u020A":"I","\u1ECA":"I","\u012E":"I","\u1E2C":"I","\u0197":"I","\u24BF":"J","\uFF2A":"J","\u0134":"J","\u0248":"J","\u24C0":"K","\uFF2B":"K","\u1E30":"K","\u01E8":"K","\u1E32":"K","\u0136":"K","\u1E34":"K","\u0198":"K","\u2C69":"K","\uA740":"K","\uA742":"K","\uA744":"K","\uA7A2":"K","\u24C1":"L","\uFF2C":"L","\u013F":"L","\u0139":"L","\u013D":"L","\u1E36":"L","\u1E38":"L","\u013B":"L","\u1E3C":"L","\u1E3A":"L","\u0141":"L","\u023D":"L","\u2C62":"L","\u2C60":"L","\uA748":"L","\uA746":"L","\uA780":"L","\u01C7":"LJ","\u01C8":"Lj","\u24C2":"M","\uFF2D":"M","\u1E3E":"M","\u1E40":"M","\u1E42":"M","\u2C6E":"M","\u019C":"M","\u24C3":"N","\uFF2E":"N","\u01F8":"N","\u0143":"N","\u00D1":"N","\u1E44":"N","\u0147":"N","\u1E46":"N","\u0145":"N","\u1E4A":"N","\u1E48":"N","\u0220":"N","\u019D":"N","\uA790":"N","\uA7A4":"N","\u01CA":"NJ","\u01CB":"Nj","\u24C4":"O","\uFF2F":"O","\u00D2":"O","\u00D3":"O","\u00D4":"O","\u1ED2":"O","\u1ED0":"O","\u1ED6":"O","\u1ED4":"O","\u00D5":"O","\u1E4C":"O","\u022C":"O","\u1E4E":"O","\u014C":"O","\u1E50":"O","\u1E52":"O","\u014E":"O","\u022E":"O","\u0230":"O","\u00D6":"O","\u022A":"O","\u1ECE":"O","\u0150":"O","\u01D1":"O","\u020C":"O","\u020E":"O","\u01A0":"O","\u1EDC":"O","\u1EDA":"O","\u1EE0":"O","\u1EDE":"O","\u1EE2":"O","\u1ECC":"O","\u1ED8":"O","\u01EA":"O","\u01EC":"O","\u00D8":"O","\u01FE":"O","\u0186":"O","\u019F":"O","\uA74A":"O","\uA74C":"O","\u01A2":"OI","\uA74E":"OO","\u0222":"OU","\u24C5":"P","\uFF30":"P","\u1E54":"P","\u1E56":"P","\u01A4":"P","\u2C63":"P","\uA750":"P","\uA752":"P","\uA754":"P","\u24C6":"Q","\uFF31":"Q","\uA756":"Q","\uA758":"Q","\u024A":"Q","\u24C7":"R","\uFF32":"R","\u0154":"R","\u1E58":"R","\u0158":"R","\u0210":"R","\u0212":"R","\u1E5A":"R","\u1E5C":"R","\u0156":"R","\u1E5E":"R","\u024C":"R","\u2C64":"R","\uA75A":"R","\uA7A6":"R","\uA782":"R","\u24C8":"S","\uFF33":"S","\u1E9E":"S","\u015A":"S","\u1E64":"S","\u015C":"S","\u1E60":"S","\u0160":"S","\u1E66":"S","\u1E62":"S","\u1E68":"S","\u0218":"S","\u015E":"S","\u2C7E":"S","\uA7A8":"S","\uA784":"S","\u24C9":"T","\uFF34":"T","\u1E6A":"T","\u0164":"T","\u1E6C":"T","\u021A":"T","\u0162":"T","\u1E70":"T","\u1E6E":"T","\u0166":"T","\u01AC":"T","\u01AE":"T","\u023E":"T","\uA786":"T","\uA728":"TZ","\u24CA":"U","\uFF35":"U","\u00D9":"U","\u00DA":"U","\u00DB":"U","\u0168":"U","\u1E78":"U","\u016A":"U","\u1E7A":"U","\u016C":"U","\u00DC":"U","\u01DB":"U","\u01D7":"U","\u01D5":"U","\u01D9":"U","\u1EE6":"U","\u016E":"U","\u0170":"U","\u01D3":"U","\u0214":"U","\u0216":"U","\u01AF":"U","\u1EEA":"U","\u1EE8":"U","\u1EEE":"U","\u1EEC":"U","\u1EF0":"U","\u1EE4":"U","\u1E72":"U","\u0172":"U","\u1E76":"U","\u1E74":"U","\u0244":"U","\u24CB":"V","\uFF36":"V","\u1E7C":"V","\u1E7E":"V","\u01B2":"V","\uA75E":"V","\u0245":"V","\uA760":"VY","\u24CC":"W","\uFF37":"W","\u1E80":"W","\u1E82":"W","\u0174":"W","\u1E86":"W","\u1E84":"W","\u1E88":"W","\u2C72":"W","\u24CD":"X","\uFF38":"X","\u1E8A":"X","\u1E8C":"X","\u24CE":"Y","\uFF39":"Y","\u1EF2":"Y","\u00DD":"Y","\u0176":"Y","\u1EF8":"Y","\u0232":"Y","\u1E8E":"Y","\u0178":"Y","\u1EF6":"Y","\u1EF4":"Y","\u01B3":"Y","\u024E":"Y","\u1EFE":"Y","\u24CF":"Z","\uFF3A":"Z","\u0179":"Z","\u1E90":"Z","\u017B":"Z","\u017D":"Z","\u1E92":"Z","\u1E94":"Z","\u01B5":"Z","\u0224":"Z","\u2C7F":"Z","\u2C6B":"Z","\uA762":"Z","\u24D0":"a","\uFF41":"a","\u1E9A":"a","\u00E0":"a","\u00E1":"a","\u00E2":"a","\u1EA7":"a","\u1EA5":"a","\u1EAB":"a","\u1EA9":"a","\u00E3":"a","\u0101":"a","\u0103":"a","\u1EB1":"a","\u1EAF":"a","\u1EB5":"a","\u1EB3":"a","\u0227":"a","\u01E1":"a","\u00E4":"a","\u01DF":"a","\u1EA3":"a","\u00E5":"a","\u01FB":"a","\u01CE":"a","\u0201":"a","\u0203":"a","\u1EA1":"a","\u1EAD":"a","\u1EB7":"a","\u1E01":"a","\u0105":"a","\u2C65":"a","\u0250":"a","\uA733":"aa","\u00E6":"ae","\u01FD":"ae","\u01E3":"ae","\uA735":"ao","\uA737":"au","\uA739":"av","\uA73B":"av","\uA73D":"ay","\u24D1":"b","\uFF42":"b","\u1E03":"b","\u1E05":"b","\u1E07":"b","\u0180":"b","\u0183":"b","\u0253":"b","\u24D2":"c","\uFF43":"c","\u0107":"c","\u0109":"c","\u010B":"c","\u010D":"c","\u00E7":"c","\u1E09":"c","\u0188":"c","\u023C":"c","\uA73F":"c","\u2184":"c","\u24D3":"d","\uFF44":"d","\u1E0B":"d","\u010F":"d","\u1E0D":"d","\u1E11":"d","\u1E13":"d","\u1E0F":"d","\u0111":"d","\u018C":"d","\u0256":"d","\u0257":"d","\uA77A":"d","\u01F3":"dz","\u01C6":"dz","\u24D4":"e","\uFF45":"e","\u00E8":"e","\u00E9":"e","\u00EA":"e","\u1EC1":"e","\u1EBF":"e","\u1EC5":"e","\u1EC3":"e","\u1EBD":"e","\u0113":"e","\u1E15":"e","\u1E17":"e","\u0115":"e","\u0117":"e","\u00EB":"e","\u1EBB":"e","\u011B":"e","\u0205":"e","\u0207":"e","\u1EB9":"e","\u1EC7":"e","\u0229":"e","\u1E1D":"e","\u0119":"e","\u1E19":"e","\u1E1B":"e","\u0247":"e","\u025B":"e","\u01DD":"e","\u24D5":"f","\uFF46":"f","\u1E1F":"f","\u0192":"f","\uA77C":"f","\u24D6":"g","\uFF47":"g","\u01F5":"g","\u011D":"g","\u1E21":"g","\u011F":"g","\u0121":"g","\u01E7":"g","\u0123":"g","\u01E5":"g","\u0260":"g","\uA7A1":"g","\u1D79":"g","\uA77F":"g","\u24D7":"h","\uFF48":"h","\u0125":"h","\u1E23":"h","\u1E27":"h","\u021F":"h","\u1E25":"h","\u1E29":"h","\u1E2B":"h","\u1E96":"h","\u0127":"h","\u2C68":"h","\u2C76":"h","\u0265":"h","\u0195":"hv","\u24D8":"i","\uFF49":"i","\u00EC":"i","\u00ED":"i","\u00EE":"i","\u0129":"i","\u012B":"i","\u012D":"i","\u00EF":"i","\u1E2F":"i","\u1EC9":"i","\u01D0":"i","\u0209":"i","\u020B":"i","\u1ECB":"i","\u012F":"i","\u1E2D":"i","\u0268":"i","\u0131":"i","\u24D9":"j","\uFF4A":"j","\u0135":"j","\u01F0":"j","\u0249":"j","\u24DA":"k","\uFF4B":"k","\u1E31":"k","\u01E9":"k","\u1E33":"k","\u0137":"k","\u1E35":"k","\u0199":"k","\u2C6A":"k","\uA741":"k","\uA743":"k","\uA745":"k","\uA7A3":"k","\u24DB":"l","\uFF4C":"l","\u0140":"l","\u013A":"l","\u013E":"l","\u1E37":"l","\u1E39":"l","\u013C":"l","\u1E3D":"l","\u1E3B":"l","\u017F":"l","\u0142":"l","\u019A":"l","\u026B":"l","\u2C61":"l","\uA749":"l","\uA781":"l","\uA747":"l","\u01C9":"lj","\u24DC":"m","\uFF4D":"m","\u1E3F":"m","\u1E41":"m","\u1E43":"m","\u0271":"m","\u026F":"m","\u24DD":"n","\uFF4E":"n","\u01F9":"n","\u0144":"n","\u00F1":"n","\u1E45":"n","\u0148":"n","\u1E47":"n","\u0146":"n","\u1E4B":"n","\u1E49":"n","\u019E":"n","\u0272":"n","\u0149":"n","\uA791":"n","\uA7A5":"n","\u01CC":"nj","\u24DE":"o","\uFF4F":"o","\u00F2":"o","\u00F3":"o","\u00F4":"o","\u1ED3":"o","\u1ED1":"o","\u1ED7":"o","\u1ED5":"o","\u00F5":"o","\u1E4D":"o","\u022D":"o","\u1E4F":"o","\u014D":"o","\u1E51":"o","\u1E53":"o","\u014F":"o","\u022F":"o","\u0231":"o","\u00F6":"o","\u022B":"o","\u1ECF":"o","\u0151":"o","\u01D2":"o","\u020D":"o","\u020F":"o","\u01A1":"o","\u1EDD":"o","\u1EDB":"o","\u1EE1":"o","\u1EDF":"o","\u1EE3":"o","\u1ECD":"o","\u1ED9":"o","\u01EB":"o","\u01ED":"o","\u00F8":"o","\u01FF":"o","\u0254":"o","\uA74B":"o","\uA74D":"o","\u0275":"o","\u01A3":"oi","\u0223":"ou","\uA74F":"oo","\u24DF":"p","\uFF50":"p","\u1E55":"p","\u1E57":"p","\u01A5":"p","\u1D7D":"p","\uA751":"p","\uA753":"p","\uA755":"p","\u24E0":"q","\uFF51":"q","\u024B":"q","\uA757":"q","\uA759":"q","\u24E1":"r","\uFF52":"r","\u0155":"r","\u1E59":"r","\u0159":"r","\u0211":"r","\u0213":"r","\u1E5B":"r","\u1E5D":"r","\u0157":"r","\u1E5F":"r","\u024D":"r","\u027D":"r","\uA75B":"r","\uA7A7":"r","\uA783":"r","\u24E2":"s","\uFF53":"s","\u00DF":"s","\u015B":"s","\u1E65":"s","\u015D":"s","\u1E61":"s","\u0161":"s","\u1E67":"s","\u1E63":"s","\u1E69":"s","\u0219":"s","\u015F":"s","\u023F":"s","\uA7A9":"s","\uA785":"s","\u1E9B":"s","\u24E3":"t","\uFF54":"t","\u1E6B":"t","\u1E97":"t","\u0165":"t","\u1E6D":"t","\u021B":"t","\u0163":"t","\u1E71":"t","\u1E6F":"t","\u0167":"t","\u01AD":"t","\u0288":"t","\u2C66":"t","\uA787":"t","\uA729":"tz","\u24E4":"u","\uFF55":"u","\u00F9":"u","\u00FA":"u","\u00FB":"u","\u0169":"u","\u1E79":"u","\u016B":"u","\u1E7B":"u","\u016D":"u","\u00FC":"u","\u01DC":"u","\u01D8":"u","\u01D6":"u","\u01DA":"u","\u1EE7":"u","\u016F":"u","\u0171":"u","\u01D4":"u","\u0215":"u","\u0217":"u","\u01B0":"u","\u1EEB":"u","\u1EE9":"u","\u1EEF":"u","\u1EED":"u","\u1EF1":"u","\u1EE5":"u","\u1E73":"u","\u0173":"u","\u1E77":"u","\u1E75":"u","\u0289":"u","\u24E5":"v","\uFF56":"v","\u1E7D":"v","\u1E7F":"v","\u028B":"v","\uA75F":"v","\u028C":"v","\uA761":"vy","\u24E6":"w","\uFF57":"w","\u1E81":"w","\u1E83":"w","\u0175":"w","\u1E87":"w","\u1E85":"w","\u1E98":"w","\u1E89":"w","\u2C73":"w","\u24E7":"x","\uFF58":"x","\u1E8B":"x","\u1E8D":"x","\u24E8":"y","\uFF59":"y","\u1EF3":"y","\u00FD":"y","\u0177":"y","\u1EF9":"y","\u0233":"y","\u1E8F":"y","\u00FF":"y","\u1EF7":"y","\u1E99":"y","\u1EF5":"y","\u01B4":"y","\u024F":"y","\u1EFF":"y","\u24E9":"z","\uFF5A":"z","\u017A":"z","\u1E91":"z","\u017C":"z","\u017E":"z","\u1E93":"z","\u1E95":"z","\u01B6":"z","\u0225":"z","\u0240":"z","\u2C6C":"z","\uA763":"z","\u0386":"\u0391","\u0388":"\u0395","\u0389":"\u0397","\u038A":"\u0399","\u03AA":"\u0399","\u038C":"\u039F","\u038E":"\u03A5","\u03AB":"\u03A5","\u038F":"\u03A9","\u03AC":"\u03B1","\u03AD":"\u03B5","\u03AE":"\u03B7","\u03AF":"\u03B9","\u03CA":"\u03B9","\u0390":"\u03B9","\u03CC":"\u03BF","\u03CD":"\u03C5","\u03CB":"\u03C5","\u03B0":"\u03C5","\u03C9":"\u03C9","\u03C2":"\u03C3"};

    $document = $(document);

    nextUid=(function() { var counter=1; return function() { return counter++; }; }());


    function reinsertElement(element) {
        var placeholder = $(document.createTextNode(''));

        element.before(placeholder);
        placeholder.before(element);
        placeholder.remove();
    }

    function stripDiacritics(str) {
        // Used 'uni range + named function' from http://jsperf.com/diacritics/18
        function match(a) {
            return DIACRITICS[a] || a;
        }

        return str.replace(/[^\u0000-\u007E]/g, match);
    }

    function indexOf(value, array) {
        var i = 0, l = array.length;
        for (; i < l; i = i + 1) {
            if (equal(value, array[i])) return i;
        }
        return -1;
    }

    function measureScrollbar () {
        var $template = $( MEASURE_SCROLLBAR_TEMPLATE );
        $template.appendTo(document.body);

        var dim = {
            width: $template.width() - $template[0].clientWidth,
            height: $template.height() - $template[0].clientHeight
        };
        $template.remove();

        return dim;
    }

    /**
     * Compares equality of a and b
     * @param a
     * @param b
     */
    function equal(a, b) {
        if (a === b) return true;
        if (a === undefined || b === undefined) return false;
        if (a === null || b === null) return false;
        // Check whether 'a' or 'b' is a string (primitive or object).
        // The concatenation of an empty string (+'') converts its argument to a string's primitive.
        if (a.constructor === String) return a+'' === b+''; // a+'' - in case 'a' is a String object
        if (b.constructor === String) return b+'' === a+''; // b+'' - in case 'b' is a String object
        return false;
    }

    /**
     * Splits the string into an array of values, transforming each value. An empty array is returned for nulls or empty
     * strings
     * @param string
     * @param separator
     */
    function splitVal(string, separator, transform) {
        var val, i, l;
        if (string === null || string.length < 1) return [];
        val = string.split(separator);
        for (i = 0, l = val.length; i < l; i = i + 1) val[i] = transform(val[i]);
        return val;
    }

    function getSideBorderPadding(element) {
        return element.outerWidth(false) - element.width();
    }

    function installKeyUpChangeEvent(element) {
        var key="keyup-change-value";
        element.on("keydown", function () {
            if ($.data(element, key) === undefined) {
                $.data(element, key, element.val());
            }
        });
        element.on("keyup", function () {
            var val= $.data(element, key);
            if (val !== undefined && element.val() !== val) {
                $.removeData(element, key);
                element.trigger("keyup-change");
            }
        });
    }


    /**
     * filters mouse events so an event is fired only if the mouse moved.
     *
     * filters out mouse events that occur when mouse is stationary but
     * the elements under the pointer are scrolled.
     */
    function installFilteredMouseMove(element) {
        element.on("mousemove", function (e) {
            var lastpos = lastMousePosition;
            if (lastpos === undefined || lastpos.x !== e.pageX || lastpos.y !== e.pageY) {
                $(e.target).trigger("mousemove-filtered", e);
            }
        });
    }

    /**
     * Debounces a function. Returns a function that calls the original fn function only if no invocations have been made
     * within the last quietMillis milliseconds.
     *
     * @param quietMillis number of milliseconds to wait before invoking fn
     * @param fn function to be debounced
     * @param ctx object to be used as this reference within fn
     * @return debounced version of fn
     */
    function debounce(quietMillis, fn, ctx) {
        ctx = ctx || undefined;
        var timeout;
        return function () {
            var args = arguments;
            window.clearTimeout(timeout);
            timeout = window.setTimeout(function() {
                fn.apply(ctx, args);
            }, quietMillis);
        };
    }

    function installDebouncedScroll(threshold, element) {
        var notify = debounce(threshold, function (e) { element.trigger("scroll-debounced", e);});
        element.on("scroll", function (e) {
            if (indexOf(e.target, element.get()) >= 0) notify(e);
        });
    }

    function focus($el) {
        if ($el[0] === document.activeElement) return;

        /* set the focus in a 0 timeout - that way the focus is set after the processing
            of the current event has finished - which seems like the only reliable way
            to set focus */
        window.setTimeout(function() {
            var el=$el[0], pos=$el.val().length, range;

            $el.focus();

            /* make sure el received focus so we do not error out when trying to manipulate the caret.
                sometimes modals or others listeners may steal it after its set */
            var isVisible = (el.offsetWidth > 0 || el.offsetHeight > 0);
            if (isVisible && el === document.activeElement) {

                /* after the focus is set move the caret to the end, necessary when we val()
                    just before setting focus */
                if(el.setSelectionRange)
                {
                    el.setSelectionRange(pos, pos);
                }
                else if (el.createTextRange) {
                    range = el.createTextRange();
                    range.collapse(false);
                    range.select();
                }
            }
        }, 0);
    }

    function getCursorInfo(el) {
        el = $(el)[0];
        var offset = 0;
        var length = 0;
        if ('selectionStart' in el) {
            offset = el.selectionStart;
            length = el.selectionEnd - offset;
        } else if ('selection' in document) {
            el.focus();
            var sel = document.selection.createRange();
            length = document.selection.createRange().text.length;
            sel.moveStart('character', -el.value.length);
            offset = sel.text.length - length;
        }
        return { offset: offset, length: length };
    }

    function killEvent(event) {
        event.preventDefault();
        event.stopPropagation();
    }
    function killEventImmediately(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
    }

    function measureTextWidth(e) {
        if (!sizer){
            var style = e[0].currentStyle || window.getComputedStyle(e[0], null);
            sizer = $(document.createElement("div")).css({
                position: "absolute",
                left: "-10000px",
                top: "-10000px",
                display: "none",
                fontSize: style.fontSize,
                fontFamily: style.fontFamily,
                fontStyle: style.fontStyle,
                fontWeight: style.fontWeight,
                letterSpacing: style.letterSpacing,
                textTransform: style.textTransform,
                whiteSpace: "nowrap"
            });
            sizer.attr("class","select2-sizer");
            $(document.body).append(sizer);
        }
        sizer.text(e.val());
        return sizer.width();
    }

    function syncCssClasses(dest, src, adapter) {
        var classes, replacements = [], adapted;

        classes = $.trim(dest.attr("class"));

        if (classes) {
            classes = '' + classes; // for IE which returns object

            $(classes.split(/\s+/)).each2(function() {
                if (this.indexOf("select2-") === 0) {
                    replacements.push(this);
                }
            });
        }

        classes = $.trim(src.attr("class"));

        if (classes) {
            classes = '' + classes; // for IE which returns object

            $(classes.split(/\s+/)).each2(function() {
                if (this.indexOf("select2-") !== 0) {
                    adapted = adapter(this);

                    if (adapted) {
                        replacements.push(adapted);
                    }
                }
            });
        }

        dest.attr("class", replacements.join(" "));
    }


    function markMatch(text, term, markup, escapeMarkup) {
        var match=stripDiacritics(text.toUpperCase()).indexOf(stripDiacritics(term.toUpperCase())),
            tl=term.length;

        if (match<0) {
            markup.push(escapeMarkup(text));
            return;
        }

        markup.push(escapeMarkup(text.substring(0, match)));
        markup.push("<span class='select2-match'>");
        markup.push(escapeMarkup(text.substring(match, match + tl)));
        markup.push("</span>");
        markup.push(escapeMarkup(text.substring(match + tl, text.length)));
    }

    function defaultEscapeMarkup(markup) {
        var replace_map = {
            '\\': '&#92;',
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            "/": '&#47;'
        };

        return String(markup).replace(/[&<>"'\/\\]/g, function (match) {
            return replace_map[match];
        });
    }

    /**
     * Produces an ajax-based query function
     *
     * @param options object containing configuration parameters
     * @param options.params parameter map for the transport ajax call, can contain such options as cache, jsonpCallback, etc. see $.ajax
     * @param options.transport function that will be used to execute the ajax request. must be compatible with parameters supported by $.ajax
     * @param options.url url for the data
     * @param options.data a function(searchTerm, pageNumber, context) that should return an object containing query string parameters for the above url.
     * @param options.dataType request data type: ajax, jsonp, other datatypes supported by jQuery's $.ajax function or the transport function if specified
     * @param options.quietMillis (optional) milliseconds to wait before making the ajaxRequest, helps debounce the ajax function if invoked too often
     * @param options.results a function(remoteData, pageNumber, query) that converts data returned form the remote request to the format expected by Select2.
     *      The expected format is an object containing the following keys:
     *      results array of objects that will be used as choices
     *      more (optional) boolean indicating whether there are more results available
     *      Example: {results:[{id:1, text:'Red'},{id:2, text:'Blue'}], more:true}
     */
    function ajax(options) {
        var timeout, // current scheduled but not yet executed request
            handler = null,
            quietMillis = options.quietMillis || 100,
            ajaxUrl = options.url,
            self = this;

        return function (query) {
            window.clearTimeout(timeout);
            timeout = window.setTimeout(function () {
                var data = options.data, // ajax data function
                    url = ajaxUrl, // ajax url string or function
                    transport = options.transport || $.fn.select2.ajaxDefaults.transport,
                    // deprecated - to be removed in 4.0  - use params instead
                    deprecated = {
                        type: options.type || 'GET', // set type of request (GET or POST)
                        cache: options.cache || false,
                        jsonpCallback: options.jsonpCallback||undefined,
                        dataType: options.dataType||"json"
                    },
                    params = $.extend({}, $.fn.select2.ajaxDefaults.params, deprecated);

                data = data ? data.call(self, query.term, query.page, query.context) : null;
                url = (typeof url === 'function') ? url.call(self, query.term, query.page, query.context) : url;

                if (handler && typeof handler.abort === "function") { handler.abort(); }

                if (options.params) {
                    if ($.isFunction(options.params)) {
                        $.extend(params, options.params.call(self));
                    } else {
                        $.extend(params, options.params);
                    }
                }

                $.extend(params, {
                    url: url,
                    dataType: options.dataType,
                    data: data,
                    success: function (data) {
                        // TODO - replace query.page with query so users have access to term, page, etc.
                        // added query as third paramter to keep backwards compatibility
                        var results = options.results(data, query.page, query);
                        query.callback(results);
                    },
                    error: function(jqXHR, textStatus, errorThrown){
                        var results = {
                            hasError: true,
                            jqXHR: jqXHR,
                            textStatus: textStatus,
                            errorThrown: errorThrown
                        };

                        query.callback(results);
                    }
                });
                handler = transport.call(self, params);
            }, quietMillis);
        };
    }

    /**
     * Produces a query function that works with a local array
     *
     * @param options object containing configuration parameters. The options parameter can either be an array or an
     * object.
     *
     * If the array form is used it is assumed that it contains objects with 'id' and 'text' keys.
     *
     * If the object form is used it is assumed that it contains 'data' and 'text' keys. The 'data' key should contain
     * an array of objects that will be used as choices. These objects must contain at least an 'id' key. The 'text'
     * key can either be a String in which case it is expected that each element in the 'data' array has a key with the
     * value of 'text' which will be used to match choices. Alternatively, text can be a function(item) that can extract
     * the text.
     */
    function local(options) {
        var data = options, // data elements
            dataText,
            tmp,
            text = function (item) { return ""+item.text; }; // function used to retrieve the text portion of a data item that is matched against the search

         if ($.isArray(data)) {
            tmp = data;
            data = { results: tmp };
        }

         if ($.isFunction(data) === false) {
            tmp = data;
            data = function() { return tmp; };
        }

        var dataItem = data();
        if (dataItem.text) {
            text = dataItem.text;
            // if text is not a function we assume it to be a key name
            if (!$.isFunction(text)) {
                dataText = dataItem.text; // we need to store this in a separate variable because in the next step data gets reset and data.text is no longer available
                text = function (item) { return item[dataText]; };
            }
        }

        return function (query) {
            var t = query.term, filtered = { results: [] }, process;
            if (t === "") {
                query.callback(data());
                return;
            }

            process = function(datum, collection) {
                var group, attr;
                datum = datum[0];
                if (datum.children) {
                    group = {};
                    for (attr in datum) {
                        if (datum.hasOwnProperty(attr)) group[attr]=datum[attr];
                    }
                    group.children=[];
                    $(datum.children).each2(function(i, childDatum) { process(childDatum, group.children); });
                    if (group.children.length || query.matcher(t, text(group), datum)) {
                        collection.push(group);
                    }
                } else {
                    if (query.matcher(t, text(datum), datum)) {
                        collection.push(datum);
                    }
                }
            };

            $(data().results).each2(function(i, datum) { process(datum, filtered.results); });
            query.callback(filtered);
        };
    }

    // TODO javadoc
    function tags(data) {
        var isFunc = $.isFunction(data);
        return function (query) {
            var t = query.term, filtered = {results: []};
            var result = isFunc ? data(query) : data;
            if ($.isArray(result)) {
                $(result).each(function () {
                    var isObject = this.text !== undefined,
                        text = isObject ? this.text : this;
                    if (t === "" || query.matcher(t, text)) {
                        filtered.results.push(isObject ? this : {id: this, text: this});
                    }
                });
                query.callback(filtered);
            }
        };
    }

    /**
     * Checks if the formatter function should be used.
     *
     * Throws an error if it is not a function. Returns true if it should be used,
     * false if no formatting should be performed.
     *
     * @param formatter
     */
    function checkFormatter(formatter, formatterName) {
        if ($.isFunction(formatter)) return true;
        if (!formatter) return false;
        if (typeof(formatter) === 'string') return true;
        throw new Error(formatterName +" must be a string, function, or falsy value");
    }

  /**
   * Returns a given value
   * If given a function, returns its output
   *
   * @param val string|function
   * @param context value of "this" to be passed to function
   * @returns {*}
   */
    function evaluate(val, context) {
        if ($.isFunction(val)) {
            var args = Array.prototype.slice.call(arguments, 2);
            return val.apply(context, args);
        }
        return val;
    }

    function countResults(results) {
        var count = 0;
        $.each(results, function(i, item) {
            if (item.children) {
                count += countResults(item.children);
            } else {
                count++;
            }
        });
        return count;
    }

    /**
     * Default tokenizer. This function uses breaks the input on substring match of any string from the
     * opts.tokenSeparators array and uses opts.createSearchChoice to create the choice object. Both of those
     * two options have to be defined in order for the tokenizer to work.
     *
     * @param input text user has typed so far or pasted into the search field
     * @param selection currently selected choices
     * @param selectCallback function(choice) callback tho add the choice to selection
     * @param opts select2's opts
     * @return undefined/null to leave the current input unchanged, or a string to change the input to the returned value
     */
    function defaultTokenizer(input, selection, selectCallback, opts) {
        var original = input, // store the original so we can compare and know if we need to tell the search to update its text
            dupe = false, // check for whether a token we extracted represents a duplicate selected choice
            token, // token
            index, // position at which the separator was found
            i, l, // looping variables
            separator; // the matched separator

        if (!opts.createSearchChoice || !opts.tokenSeparators || opts.tokenSeparators.length < 1) return undefined;

        while (true) {
            index = -1;

            for (i = 0, l = opts.tokenSeparators.length; i < l; i++) {
                separator = opts.tokenSeparators[i];
                index = input.indexOf(separator);
                if (index >= 0) break;
            }

            if (index < 0) break; // did not find any token separator in the input string, bail

            token = input.substring(0, index);
            input = input.substring(index + separator.length);

            if (token.length > 0) {
                token = opts.createSearchChoice.call(this, token, selection);
                if (token !== undefined && token !== null && opts.id(token) !== undefined && opts.id(token) !== null) {
                    dupe = false;
                    for (i = 0, l = selection.length; i < l; i++) {
                        if (equal(opts.id(token), opts.id(selection[i]))) {
                            dupe = true; break;
                        }
                    }

                    if (!dupe) selectCallback(token);
                }
            }
        }

        if (original!==input) return input;
    }

    function cleanupJQueryElements() {
        var self = this;

        $.each(arguments, function (i, element) {
            self[element].remove();
            self[element] = null;
        });
    }

    /**
     * Creates a new class
     *
     * @param superClass
     * @param methods
     */
    function clazz(SuperClass, methods) {
        var constructor = function () {};
        constructor.prototype = new SuperClass;
        constructor.prototype.constructor = constructor;
        constructor.prototype.parent = SuperClass.prototype;
        constructor.prototype = $.extend(constructor.prototype, methods);
        return constructor;
    }

    AbstractSelect2 = clazz(Object, {

        // abstract
        bind: function (func) {
            var self = this;
            return function () {
                func.apply(self, arguments);
            };
        },

        // abstract
        init: function (opts) {
            var results, search, resultsSelector = ".select2-results";

            // prepare options
            this.opts = opts = this.prepareOpts(opts);

            this.id=opts.id;

            // destroy if called on an existing component
            if (opts.element.data("select2") !== undefined &&
                opts.element.data("select2") !== null) {
                opts.element.data("select2").destroy();
            }

            this.container = this.createContainer();

            this.liveRegion = $('.select2-hidden-accessible');
            if (this.liveRegion.length == 0) {
                this.liveRegion = $("<span>", {
                        role: "status",
                        "aria-live": "polite"
                    })
                    .addClass("select2-hidden-accessible")
                    .appendTo(document.body);
            }

            this.containerId="s2id_"+(opts.element.attr("id") || "autogen"+nextUid());
            this.containerEventName= this.containerId
                .replace(/([.])/g, '_')
                .replace(/([;&,\-\.\+\*\~':"\!\^#$%@\[\]\(\)=>\|])/g, '\\$1');
            this.container.attr("id", this.containerId);

            this.container.attr("title", opts.element.attr("title"));

            this.body = $(document.body);

            syncCssClasses(this.container, this.opts.element, this.opts.adaptContainerCssClass);

            this.container.attr("style", opts.element.attr("style"));
            this.container.css(evaluate(opts.containerCss, this.opts.element));
            this.container.addClass(evaluate(opts.containerCssClass, this.opts.element));

            this.elementTabIndex = this.opts.element.attr("tabindex");

            // swap container for the element
            this.opts.element
                .data("select2", this)
                .attr("tabindex", "-1")
                .before(this.container)
                .on("click.select2", killEvent); // do not leak click events

            this.container.data("select2", this);

            this.dropdown = this.container.find(".select2-drop");

            syncCssClasses(this.dropdown, this.opts.element, this.opts.adaptDropdownCssClass);

            this.dropdown.addClass(evaluate(opts.dropdownCssClass, this.opts.element));
            this.dropdown.data("select2", this);
            this.dropdown.on("click", killEvent);

            this.results = results = this.container.find(resultsSelector);
            this.search = search = this.container.find("input.select2-input");

            this.queryCount = 0;
            this.resultsPage = 0;
            this.context = null;

            // initialize the container
            this.initContainer();

            this.container.on("click", killEvent);

            installFilteredMouseMove(this.results);

            this.dropdown.on("mousemove-filtered", resultsSelector, this.bind(this.highlightUnderEvent));
            this.dropdown.on("touchstart touchmove touchend", resultsSelector, this.bind(function (event) {
                this._touchEvent = true;
                this.highlightUnderEvent(event);
            }));
            this.dropdown.on("touchmove", resultsSelector, this.bind(this.touchMoved));
            this.dropdown.on("touchstart touchend", resultsSelector, this.bind(this.clearTouchMoved));

            // Waiting for a click event on touch devices to select option and hide dropdown
            // otherwise click will be triggered on an underlying element
            this.dropdown.on('click', this.bind(function (event) {
                if (this._touchEvent) {
                    this._touchEvent = false;
                    this.selectHighlighted();
                }
            }));

            installDebouncedScroll(80, this.results);
            this.dropdown.on("scroll-debounced", resultsSelector, this.bind(this.loadMoreIfNeeded));

            // do not propagate change event from the search field out of the component
            $(this.container).on("change", ".select2-input", function(e) {e.stopPropagation();});
            $(this.dropdown).on("change", ".select2-input", function(e) {e.stopPropagation();});

            // if jquery.mousewheel plugin is installed we can prevent out-of-bounds scrolling of results via mousewheel
            if ($.fn.mousewheel) {
                results.mousewheel(function (e, delta, deltaX, deltaY) {
                    var top = results.scrollTop();
                    if (deltaY > 0 && top - deltaY <= 0) {
                        results.scrollTop(0);
                        killEvent(e);
                    } else if (deltaY < 0 && results.get(0).scrollHeight - results.scrollTop() + deltaY <= results.height()) {
                        results.scrollTop(results.get(0).scrollHeight - results.height());
                        killEvent(e);
                    }
                });
            }

            installKeyUpChangeEvent(search);
            search.on("keyup-change input paste", this.bind(this.updateResults));
            search.on("focus", function () { search.addClass("select2-focused"); });
            search.on("blur", function () { search.removeClass("select2-focused");});

            this.dropdown.on("mouseup", resultsSelector, this.bind(function (e) {
                if ($(e.target).closest(".select2-result-selectable").length > 0) {
                    this.highlightUnderEvent(e);
                    this.selectHighlighted(e);
                }
            }));

            // trap all mouse events from leaving the dropdown. sometimes there may be a modal that is listening
            // for mouse events outside of itself so it can close itself. since the dropdown is now outside the select2's
            // dom it will trigger the popup close, which is not what we want
            // focusin can cause focus wars between modals and select2 since the dropdown is outside the modal.
            this.dropdown.on("click mouseup mousedown touchstart touchend focusin", function (e) { e.stopPropagation(); });

            this.nextSearchTerm = undefined;

            if ($.isFunction(this.opts.initSelection)) {
                // initialize selection based on the current value of the source element
                this.initSelection();

                // if the user has provided a function that can set selection based on the value of the source element
                // we monitor the change event on the element and trigger it, allowing for two way synchronization
                this.monitorSource();
            }

            if (opts.maximumInputLength !== null) {
                this.search.attr("maxlength", opts.maximumInputLength);
            }

            var disabled = opts.element.prop("disabled");
            if (disabled === undefined) disabled = false;
            this.enable(!disabled);

            var readonly = opts.element.prop("readonly");
            if (readonly === undefined) readonly = false;
            this.readonly(readonly);

            // Calculate size of scrollbar
            scrollBarDimensions = scrollBarDimensions || measureScrollbar();

            this.autofocus = opts.element.prop("autofocus");
            opts.element.prop("autofocus", false);
            if (this.autofocus) this.focus();

            this.search.attr("placeholder", opts.searchInputPlaceholder);
        },

        // abstract
        destroy: function () {
            var element=this.opts.element, select2 = element.data("select2"), self = this;

            this.close();

            if (element.length && element[0].detachEvent && self._sync) {
                element.each(function () {
                    if (self._sync) {
                        this.detachEvent("onpropertychange", self._sync);
                    }
                });
            }
            if (this.propertyObserver) {
                this.propertyObserver.disconnect();
                this.propertyObserver = null;
            }
            this._sync = null;

            if (select2 !== undefined) {
                select2.container.remove();
                select2.liveRegion.remove();
                select2.dropdown.remove();
                element
                    .show()
                    .removeData("select2")
                    .off(".select2")
                    .prop("autofocus", this.autofocus || false);
                if (this.elementTabIndex) {
                    element.attr({tabindex: this.elementTabIndex});
                } else {
                    element.removeAttr("tabindex");
                }
                element.show();
            }

            cleanupJQueryElements.call(this,
                "container",
                "liveRegion",
                "dropdown",
                "results",
                "search"
            );
        },

        // abstract
        optionToData: function(element) {
            if (element.is("option")) {
                return {
                    id:element.prop("value"),
                    text:element.text(),
                    element: element.get(),
                    css: element.attr("class"),
                    disabled: element.prop("disabled"),
                    locked: equal(element.attr("locked"), "locked") || equal(element.data("locked"), true)
                };
            } else if (element.is("optgroup")) {
                return {
                    text:element.attr("label"),
                    children:[],
                    element: element.get(),
                    css: element.attr("class")
                };
            }
        },

        // abstract
        prepareOpts: function (opts) {
            var element, select, idKey, ajaxUrl, self = this;

            element = opts.element;

            if (element.get(0).tagName.toLowerCase() === "select") {
                this.select = select = opts.element;
            }

            if (select) {
                // these options are not allowed when attached to a select because they are picked up off the element itself
                $.each(["id", "multiple", "ajax", "query", "createSearchChoice", "initSelection", "data", "tags"], function () {
                    if (this in opts) {
                        throw new Error("Option '" + this + "' is not allowed for Select2 when attached to a <select> element.");
                    }
                });
            }

            opts = $.extend({}, {
                populateResults: function(container, results, query) {
                    var populate, id=this.opts.id, liveRegion=this.liveRegion;

                    populate=function(results, container, depth) {

                        var i, l, result, selectable, disabled, compound, node, label, innerContainer, formatted;

                        results = opts.sortResults(results, container, query);

                        // collect the created nodes for bulk append
                        var nodes = [];
                        for (i = 0, l = results.length; i < l; i = i + 1) {

                            result=results[i];

                            disabled = (result.disabled === true);
                            selectable = (!disabled) && (id(result) !== undefined);

                            compound=result.children && result.children.length > 0;

                            node=$("<li></li>");
                            node.addClass("select2-results-dept-"+depth);
                            node.addClass("select2-result");
                            node.addClass(selectable ? "select2-result-selectable" : "select2-result-unselectable");
                            if (disabled) { node.addClass("select2-disabled"); }
                            if (compound) { node.addClass("select2-result-with-children"); }
                            node.addClass(self.opts.formatResultCssClass(result));
                            node.attr("role", "presentation");

                            label=$(document.createElement("div"));
                            label.addClass("select2-result-label");
                            label.attr("id", "select2-result-label-" + nextUid());
                            label.attr("role", "option");

                            formatted=opts.formatResult(result, label, query, self.opts.escapeMarkup);
                            if (formatted!==undefined) {
                                label.html(formatted);
                                node.append(label);
                            }


                            if (compound) {

                                innerContainer=$("<ul></ul>");
                                innerContainer.addClass("select2-result-sub");
                                populate(result.children, innerContainer, depth+1);
                                node.append(innerContainer);
                            }

                            node.data("select2-data", result);
                            nodes.push(node[0]);
                        }

                        // bulk append the created nodes
                        container.append(nodes);
                        liveRegion.text(opts.formatMatches(results.length));
                    };

                    populate(results, container, 0);
                }
            }, $.fn.select2.defaults, opts);

            if (typeof(opts.id) !== "function") {
                idKey = opts.id;
                opts.id = function (e) { return e[idKey]; };
            }

            if ($.isArray(opts.element.data("select2Tags"))) {
                if ("tags" in opts) {
                    throw "tags specified as both an attribute 'data-select2-tags' and in options of Select2 " + opts.element.attr("id");
                }
                opts.tags=opts.element.data("select2Tags");
            }

            if (select) {
                opts.query = this.bind(function (query) {
                    var data = { results: [], more: false },
                        term = query.term,
                        children, placeholderOption, process;

                    process=function(element, collection) {
                        var group;
                        if (element.is("option")) {
                            if (query.matcher(term, element.text(), element)) {
                                collection.push(self.optionToData(element));
                            }
                        } else if (element.is("optgroup")) {
                            group=self.optionToData(element);
                            element.children().each2(function(i, elm) { process(elm, group.children); });
                            if (group.children.length>0) {
                                collection.push(group);
                            }
                        }
                    };

                    children=element.children();

                    // ignore the placeholder option if there is one
                    if (this.getPlaceholder() !== undefined && children.length > 0) {
                        placeholderOption = this.getPlaceholderOption();
                        if (placeholderOption) {
                            children=children.not(placeholderOption);
                        }
                    }

                    children.each2(function(i, elm) { process(elm, data.results); });

                    query.callback(data);
                });
                // this is needed because inside val() we construct choices from options and their id is hardcoded
                opts.id=function(e) { return e.id; };
            } else {
                if (!("query" in opts)) {

                    if ("ajax" in opts) {
                        ajaxUrl = opts.element.data("ajax-url");
                        if (ajaxUrl && ajaxUrl.length > 0) {
                            opts.ajax.url = ajaxUrl;
                        }
                        opts.query = ajax.call(opts.element, opts.ajax);
                    } else if ("data" in opts) {
                        opts.query = local(opts.data);
                    } else if ("tags" in opts) {
                        opts.query = tags(opts.tags);
                        if (opts.createSearchChoice === undefined) {
                            opts.createSearchChoice = function (term) { return {id: $.trim(term), text: $.trim(term)}; };
                        }
                        if (opts.initSelection === undefined) {
                            opts.initSelection = function (element, callback) {
                                var data = [];
                                $(splitVal(element.val(), opts.separator, opts.transformVal)).each(function () {
                                    var obj = { id: this, text: this },
                                        tags = opts.tags;
                                    if ($.isFunction(tags)) tags=tags();
                                    $(tags).each(function() { if (equal(this.id, obj.id)) { obj = this; return false; } });
                                    data.push(obj);
                                });

                                callback(data);
                            };
                        }
                    }
                }
            }
            if (typeof(opts.query) !== "function") {
                throw "query function not defined for Select2 " + opts.element.attr("id");
            }

            if (opts.createSearchChoicePosition === 'top') {
                opts.createSearchChoicePosition = function(list, item) { list.unshift(item); };
            }
            else if (opts.createSearchChoicePosition === 'bottom') {
                opts.createSearchChoicePosition = function(list, item) { list.push(item); };
            }
            else if (typeof(opts.createSearchChoicePosition) !== "function")  {
                throw "invalid createSearchChoicePosition option must be 'top', 'bottom' or a custom function";
            }

            return opts;
        },

        /**
         * Monitor the original element for changes and update select2 accordingly
         */
        // abstract
        monitorSource: function () {
            var el = this.opts.element, observer, self = this;

            el.on("change.select2", this.bind(function (e) {
                if (this.opts.element.data("select2-change-triggered") !== true) {
                    this.initSelection();
                }
            }));

            this._sync = this.bind(function () {

                // sync enabled state
                var disabled = el.prop("disabled");
                if (disabled === undefined) disabled = false;
                this.enable(!disabled);

                var readonly = el.prop("readonly");
                if (readonly === undefined) readonly = false;
                this.readonly(readonly);

                if (this.container) {
                    syncCssClasses(this.container, this.opts.element, this.opts.adaptContainerCssClass);
                    this.container.addClass(evaluate(this.opts.containerCssClass, this.opts.element));
                }

                if (this.dropdown) {
                    syncCssClasses(this.dropdown, this.opts.element, this.opts.adaptDropdownCssClass);
                    this.dropdown.addClass(evaluate(this.opts.dropdownCssClass, this.opts.element));
                }

            });

            // IE8-10 (IE9/10 won't fire propertyChange via attachEventListener)
            if (el.length && el[0].attachEvent) {
                el.each(function() {
                    this.attachEvent("onpropertychange", self._sync);
                });
            }

            // safari, chrome, firefox, IE11
            observer = window.MutationObserver || window.WebKitMutationObserver|| window.MozMutationObserver;
            if (observer !== undefined) {
                if (this.propertyObserver) { delete this.propertyObserver; this.propertyObserver = null; }
                this.propertyObserver = new observer(function (mutations) {
                    $.each(mutations, self._sync);
                });
                this.propertyObserver.observe(el.get(0), { attributes:true, subtree:false });
            }
        },

        // abstract
        triggerSelect: function(data) {
            var evt = $.Event("select2-selecting", { val: this.id(data), object: data, choice: data });
            this.opts.element.trigger(evt);
            return !evt.isDefaultPrevented();
        },

        /**
         * Triggers the change event on the source element
         */
        // abstract
        triggerChange: function (details) {

            details = details || {};
            details= $.extend({}, details, { type: "change", val: this.val() });
            // prevents recursive triggering
            this.opts.element.data("select2-change-triggered", true);
            this.opts.element.trigger(details);
            this.opts.element.data("select2-change-triggered", false);

            // some validation frameworks ignore the change event and listen instead to keyup, click for selects
            // so here we trigger the click event manually
            this.opts.element.click();

            // ValidationEngine ignores the change event and listens instead to blur
            // so here we trigger the blur event manually if so desired
            if (this.opts.blurOnChange)
                this.opts.element.blur();
        },

        //abstract
        isInterfaceEnabled: function()
        {
            return this.enabledInterface === true;
        },

        // abstract
        enableInterface: function() {
            var enabled = this._enabled && !this._readonly,
                disabled = !enabled;

            if (enabled === this.enabledInterface) return false;

            this.container.toggleClass("select2-container-disabled", disabled);
            this.close();
            this.enabledInterface = enabled;

            return true;
        },

        // abstract
        enable: function(enabled) {
            if (enabled === undefined) enabled = true;
            if (this._enabled === enabled) return;
            this._enabled = enabled;

            this.opts.element.prop("disabled", !enabled);
            this.enableInterface();
        },

        // abstract
        disable: function() {
            this.enable(false);
        },

        // abstract
        readonly: function(enabled) {
            if (enabled === undefined) enabled = false;
            if (this._readonly === enabled) return;
            this._readonly = enabled;

            this.opts.element.prop("readonly", enabled);
            this.enableInterface();
        },

        // abstract
        opened: function () {
            return (this.container) ? this.container.hasClass("select2-dropdown-open") : false;
        },

        // abstract
        positionDropdown: function() {
            var $dropdown = this.dropdown,
                container = this.container,
                offset = container.offset(),
                height = container.outerHeight(false),
                width = container.outerWidth(false),
                dropHeight = $dropdown.outerHeight(false),
                $window = $(window),
                windowWidth = $window.width(),
                windowHeight = $window.height(),
                viewPortRight = $window.scrollLeft() + windowWidth,
                viewportBottom = $window.scrollTop() + windowHeight,
                dropTop = offset.top + height,
                dropLeft = offset.left,
                enoughRoomBelow = dropTop + dropHeight <= viewportBottom,
                enoughRoomAbove = (offset.top - dropHeight) >= $window.scrollTop(),
                dropWidth = $dropdown.outerWidth(false),
                enoughRoomOnRight = function() {
                    return dropLeft + dropWidth <= viewPortRight;
                },
                enoughRoomOnLeft = function() {
                    return offset.left + viewPortRight + container.outerWidth(false)  > dropWidth;
                },
                aboveNow = $dropdown.hasClass("select2-drop-above"),
                bodyOffset,
                above,
                changeDirection,
                css,
                resultsListNode;

            // always prefer the current above/below alignment, unless there is not enough room
            if (aboveNow) {
                above = true;
                if (!enoughRoomAbove && enoughRoomBelow) {
                    changeDirection = true;
                    above = false;
                }
            } else {
                above = false;
                if (!enoughRoomBelow && enoughRoomAbove) {
                    changeDirection = true;
                    above = true;
                }
            }

            //if we are changing direction we need to get positions when dropdown is hidden;
            if (changeDirection) {
                $dropdown.hide();
                offset = this.container.offset();
                height = this.container.outerHeight(false);
                width = this.container.outerWidth(false);
                dropHeight = $dropdown.outerHeight(false);
                viewPortRight = $window.scrollLeft() + windowWidth;
                viewportBottom = $window.scrollTop() + windowHeight;
                dropTop = offset.top + height;
                dropLeft = offset.left;
                dropWidth = $dropdown.outerWidth(false);
                $dropdown.show();

                // fix so the cursor does not move to the left within the search-textbox in IE
                this.focusSearch();
            }

            if (this.opts.dropdownAutoWidth) {
                resultsListNode = $('.select2-results', $dropdown)[0];
                $dropdown.addClass('select2-drop-auto-width');
                $dropdown.css('width', '');
                // Add scrollbar width to dropdown if vertical scrollbar is present
                dropWidth = $dropdown.outerWidth(false) + (resultsListNode.scrollHeight === resultsListNode.clientHeight ? 0 : scrollBarDimensions.width);
                dropWidth > width ? width = dropWidth : dropWidth = width;
                dropHeight = $dropdown.outerHeight(false);
            }
            else {
                this.container.removeClass('select2-drop-auto-width');
            }

            //console.log("below/ droptop:", dropTop, "dropHeight", dropHeight, "sum", (dropTop+dropHeight)+" viewport bottom", viewportBottom, "enough?", enoughRoomBelow);
            //console.log("above/ offset.top", offset.top, "dropHeight", dropHeight, "top", (offset.top-dropHeight), "scrollTop", this.body.scrollTop(), "enough?", enoughRoomAbove);

            // fix positioning when body has an offset and is not position: static
            if (this.body.css('position') !== 'static') {
                bodyOffset = this.body.offset();
                dropTop -= bodyOffset.top;
                dropLeft -= bodyOffset.left;
            }

            if (!enoughRoomOnRight() && enoughRoomOnLeft()) {
                dropLeft = offset.left + this.container.outerWidth(false) - dropWidth;
            }

            css =  {
                left: dropLeft,
                width: width
            };

            if (above) {
                css.top = offset.top - dropHeight;
                css.bottom = 'auto';
                this.container.addClass("select2-drop-above");
                $dropdown.addClass("select2-drop-above");
            }
            else {
                css.top = dropTop;
                css.bottom = 'auto';
                this.container.removeClass("select2-drop-above");
                $dropdown.removeClass("select2-drop-above");
            }
            css = $.extend(css, evaluate(this.opts.dropdownCss, this.opts.element));

            $dropdown.css(css);
        },

        // abstract
        shouldOpen: function() {
            var event;

            if (this.opened()) return false;

            if (this._enabled === false || this._readonly === true) return false;

            event = $.Event("select2-opening");
            this.opts.element.trigger(event);
            return !event.isDefaultPrevented();
        },

        // abstract
        clearDropdownAlignmentPreference: function() {
            // clear the classes used to figure out the preference of where the dropdown should be opened
            this.container.removeClass("select2-drop-above");
            this.dropdown.removeClass("select2-drop-above");
        },

        /**
         * Opens the dropdown
         *
         * @return {Boolean} whether or not dropdown was opened. This method will return false if, for example,
         * the dropdown is already open, or if the 'open' event listener on the element called preventDefault().
         */
        // abstract
        open: function () {

            if (!this.shouldOpen()) return false;

            this.opening();

            // Only bind the document mousemove when the dropdown is visible
            $document.on("mousemove.select2Event", function (e) {
                lastMousePosition.x = e.pageX;
                lastMousePosition.y = e.pageY;
            });

            return true;
        },

        /**
         * Performs the opening of the dropdown
         */
        // abstract
        opening: function() {
            var cid = this.containerEventName,
                scroll = "scroll." + cid,
                resize = "resize."+cid,
                orient = "orientationchange."+cid,
                mask;

            this.container.addClass("select2-dropdown-open").addClass("select2-container-active");

            this.clearDropdownAlignmentPreference();

            if(this.dropdown[0] !== this.body.children().last()[0]) {
                this.dropdown.detach().appendTo(this.body);
            }

            // create the dropdown mask if doesn't already exist
            mask = $("#select2-drop-mask");
            if (mask.length === 0) {
                mask = $(document.createElement("div"));
                mask.attr("id","select2-drop-mask").attr("class","select2-drop-mask");
                mask.hide();
                mask.appendTo(this.body);
                mask.on("mousedown touchstart click", function (e) {
                    // Prevent IE from generating a click event on the body
                    reinsertElement(mask);

                    var dropdown = $("#select2-drop"), self;
                    if (dropdown.length > 0) {
                        self=dropdown.data("select2");
                        if (self.opts.selectOnBlur) {
                            self.selectHighlighted({noFocus: true});
                        }
                        self.close();
                        e.preventDefault();
                        e.stopPropagation();
                    }
                });
            }

            // ensure the mask is always right before the dropdown
            if (this.dropdown.prev()[0] !== mask[0]) {
                this.dropdown.before(mask);
            }

            // move the global id to the correct dropdown
            $("#select2-drop").removeAttr("id");
            this.dropdown.attr("id", "select2-drop");

            // show the elements
            mask.show();

            this.positionDropdown();
            this.dropdown.show();
            this.positionDropdown();

            this.dropdown.addClass("select2-drop-active");

            // attach listeners to events that can change the position of the container and thus require
            // the position of the dropdown to be updated as well so it does not come unglued from the container
            var that = this;
            this.container.parents().add(window).each(function () {
                $(this).on(resize+" "+scroll+" "+orient, function (e) {
                    if (that.opened()) that.positionDropdown();
                });
            });


        },

        // abstract
        close: function () {
            if (!this.opened()) return;

            var cid = this.containerEventName,
                scroll = "scroll." + cid,
                resize = "resize."+cid,
                orient = "orientationchange."+cid;

            // unbind event listeners
            this.container.parents().add(window).each(function () { $(this).off(scroll).off(resize).off(orient); });

            this.clearDropdownAlignmentPreference();

            $("#select2-drop-mask").hide();
            this.dropdown.removeAttr("id"); // only the active dropdown has the select2-drop id
            this.dropdown.hide();
            this.container.removeClass("select2-dropdown-open").removeClass("select2-container-active");
            this.results.empty();

            // Now that the dropdown is closed, unbind the global document mousemove event
            $document.off("mousemove.select2Event");

            this.clearSearch();
            this.search.removeClass("select2-active");
            this.opts.element.trigger($.Event("select2-close"));
        },

        /**
         * Opens control, sets input value, and updates results.
         */
        // abstract
        externalSearch: function (term) {
            this.open();
            this.search.val(term);
            this.updateResults(false);
        },

        // abstract
        clearSearch: function () {

        },

        //abstract
        getMaximumSelectionSize: function() {
            return evaluate(this.opts.maximumSelectionSize, this.opts.element);
        },

        // abstract
        ensureHighlightVisible: function () {
            var results = this.results, children, index, child, hb, rb, y, more, topOffset;

            index = this.highlight();

            if (index < 0) return;

            if (index == 0) {

                // if the first element is highlighted scroll all the way to the top,
                // that way any unselectable headers above it will also be scrolled
                // into view

                results.scrollTop(0);
                return;
            }

            children = this.findHighlightableChoices().find('.select2-result-label');

            child = $(children[index]);

            topOffset = (child.offset() || {}).top || 0;

            hb = topOffset + child.outerHeight(true);

            // if this is the last child lets also make sure select2-more-results is visible
            if (index === children.length - 1) {
                more = results.find("li.select2-more-results");
                if (more.length > 0) {
                    hb = more.offset().top + more.outerHeight(true);
                }
            }

            rb = results.offset().top + results.outerHeight(false);
            if (hb > rb) {
                results.scrollTop(results.scrollTop() + (hb - rb));
            }
            y = topOffset - results.offset().top;

            // make sure the top of the element is visible
            if (y < 0 && child.css('display') != 'none' ) {
                results.scrollTop(results.scrollTop() + y); // y is negative
            }
        },

        // abstract
        findHighlightableChoices: function() {
            return this.results.find(".select2-result-selectable:not(.select2-disabled):not(.select2-selected)");
        },

        // abstract
        moveHighlight: function (delta) {
            var choices = this.findHighlightableChoices(),
                index = this.highlight();

            while (index > -1 && index < choices.length) {
                index += delta;
                var choice = $(choices[index]);
                if (choice.hasClass("select2-result-selectable") && !choice.hasClass("select2-disabled") && !choice.hasClass("select2-selected")) {
                    this.highlight(index);
                    break;
                }
            }
        },

        // abstract
        highlight: function (index) {
            var choices = this.findHighlightableChoices(),
                choice,
                data;

            if (arguments.length === 0) {
                return indexOf(choices.filter(".select2-highlighted")[0], choices.get());
            }

            if (index >= choices.length) index = choices.length - 1;
            if (index < 0) index = 0;

            this.removeHighlight();

            choice = $(choices[index]);
            choice.addClass("select2-highlighted");

            // ensure assistive technology can determine the active choice
            this.search.attr("aria-activedescendant", choice.find(".select2-result-label").attr("id"));

            this.ensureHighlightVisible();

            this.liveRegion.text(choice.text());

            data = choice.data("select2-data");
            if (data) {
                this.opts.element.trigger({ type: "select2-highlight", val: this.id(data), choice: data });
            }
        },

        removeHighlight: function() {
            this.results.find(".select2-highlighted").removeClass("select2-highlighted");
        },

        touchMoved: function() {
            this._touchMoved = true;
        },

        clearTouchMoved: function() {
          this._touchMoved = false;
        },

        // abstract
        countSelectableResults: function() {
            return this.findHighlightableChoices().length;
        },

        // abstract
        highlightUnderEvent: function (event) {
            var el = $(event.target).closest(".select2-result-selectable");
            if (el.length > 0 && !el.is(".select2-highlighted")) {
                var choices = this.findHighlightableChoices();
                this.highlight(choices.index(el));
            } else if (el.length == 0) {
                // if we are over an unselectable item remove all highlights
                this.removeHighlight();
            }
        },

        // abstract
        loadMoreIfNeeded: function () {
            var results = this.results,
                more = results.find("li.select2-more-results"),
                below, // pixels the element is below the scroll fold, below==0 is when the element is starting to be visible
                page = this.resultsPage + 1,
                self=this,
                term=this.search.val(),
                context=this.context;

            if (more.length === 0) return;
            below = more.offset().top - results.offset().top - results.height();

            if (below <= this.opts.loadMorePadding) {
                more.addClass("select2-active");
                this.opts.query({
                        element: this.opts.element,
                        term: term,
                        page: page,
                        context: context,
                        matcher: this.opts.matcher,
                        callback: this.bind(function (data) {

                    // ignore a response if the select2 has been closed before it was received
                    if (!self.opened()) return;


                    self.opts.populateResults.call(this, results, data.results, {term: term, page: page, context:context});
                    self.postprocessResults(data, false, false);

                    if (data.more===true) {
                        more.detach().appendTo(results).html(self.opts.escapeMarkup(evaluate(self.opts.formatLoadMore, self.opts.element, page+1)));
                        window.setTimeout(function() { self.loadMoreIfNeeded(); }, 10);
                    } else {
                        more.remove();
                    }
                    self.positionDropdown();
                    self.resultsPage = page;
                    self.context = data.context;
                    this.opts.element.trigger({ type: "select2-loaded", items: data });
                })});
            }
        },

        /**
         * Default tokenizer function which does nothing
         */
        tokenize: function() {

        },

        /**
         * @param initial whether or not this is the call to this method right after the dropdown has been opened
         */
        // abstract
        updateResults: function (initial) {
            var search = this.search,
                results = this.results,
                opts = this.opts,
                data,
                self = this,
                input,
                term = search.val(),
                lastTerm = $.data(this.container, "select2-last-term"),
                // sequence number used to drop out-of-order responses
                queryNumber;

            // prevent duplicate queries against the same term
            if (initial !== true && lastTerm && equal(term, lastTerm)) return;

            $.data(this.container, "select2-last-term", term);

            // if the search is currently hidden we do not alter the results
            if (initial !== true && (this.showSearchInput === false || !this.opened())) {
                return;
            }

            function postRender() {
                search.removeClass("select2-active");
                self.positionDropdown();
                if (results.find('.select2-no-results,.select2-selection-limit,.select2-searching').length) {
                    self.liveRegion.text(results.text());
                }
                else {
                    self.liveRegion.text(self.opts.formatMatches(results.find('.select2-result-selectable:not(".select2-selected")').length));
                }
            }

            function render(html) {
                results.html(html);
                postRender();
            }

            queryNumber = ++this.queryCount;

            var maxSelSize = this.getMaximumSelectionSize();
            if (maxSelSize >=1) {
                data = this.data();
                if ($.isArray(data) && data.length >= maxSelSize && checkFormatter(opts.formatSelectionTooBig, "formatSelectionTooBig")) {
                    render("<li class='select2-selection-limit'>" + evaluate(opts.formatSelectionTooBig, opts.element, maxSelSize) + "</li>");
                    return;
                }
            }

            if (search.val().length < opts.minimumInputLength) {
                if (checkFormatter(opts.formatInputTooShort, "formatInputTooShort")) {
                    render("<li class='select2-no-results'>" + evaluate(opts.formatInputTooShort, opts.element, search.val(), opts.minimumInputLength) + "</li>");
                } else {
                    render("");
                }
                if (initial && this.showSearch) this.showSearch(true);
                return;
            }

            if (opts.maximumInputLength && search.val().length > opts.maximumInputLength) {
                if (checkFormatter(opts.formatInputTooLong, "formatInputTooLong")) {
                    render("<li class='select2-no-results'>" + evaluate(opts.formatInputTooLong, opts.element, search.val(), opts.maximumInputLength) + "</li>");
                } else {
                    render("");
                }
                return;
            }

            if (opts.formatSearching && this.findHighlightableChoices().length === 0) {
                render("<li class='select2-searching'>" + evaluate(opts.formatSearching, opts.element) + "</li>");
            }

            search.addClass("select2-active");

            this.removeHighlight();

            // give the tokenizer a chance to pre-process the input
            input = this.tokenize();
            if (input != undefined && input != null) {
                search.val(input);
            }

            this.resultsPage = 1;

            opts.query({
                element: opts.element,
                    term: search.val(),
                    page: this.resultsPage,
                    context: null,
                    matcher: opts.matcher,
                    callback: this.bind(function (data) {
                var def; // default choice

                // ignore old responses
                if (queryNumber != this.queryCount) {
                  return;
                }

                // ignore a response if the select2 has been closed before it was received
                if (!this.opened()) {
                    this.search.removeClass("select2-active");
                    return;
                }

                // handle ajax error
                if(data.hasError !== undefined && checkFormatter(opts.formatAjaxError, "formatAjaxError")) {
                    render("<li class='select2-ajax-error'>" + evaluate(opts.formatAjaxError, opts.element, data.jqXHR, data.textStatus, data.errorThrown) + "</li>");
                    return;
                }

                // save context, if any
                this.context = (data.context===undefined) ? null : data.context;
                // create a default choice and prepend it to the list
                if (this.opts.createSearchChoice && search.val() !== "") {
                    def = this.opts.createSearchChoice.call(self, search.val(), data.results);
                    if (def !== undefined && def !== null && self.id(def) !== undefined && self.id(def) !== null) {
                        if ($(data.results).filter(
                            function () {
                                return equal(self.id(this), self.id(def));
                            }).length === 0) {
                            this.opts.createSearchChoicePosition(data.results, def);
                        }
                    }
                }

                if (data.results.length === 0 && checkFormatter(opts.formatNoMatches, "formatNoMatches")) {
                    render("<li class='select2-no-results'>" + evaluate(opts.formatNoMatches, opts.element, search.val()) + "</li>");
                    return;
                }

                results.empty();
                self.opts.populateResults.call(this, results, data.results, {term: search.val(), page: this.resultsPage, context:null});

                if (data.more === true && checkFormatter(opts.formatLoadMore, "formatLoadMore")) {
                    results.append("<li class='select2-more-results'>" + opts.escapeMarkup(evaluate(opts.formatLoadMore, opts.element, this.resultsPage)) + "</li>");
                    window.setTimeout(function() { self.loadMoreIfNeeded(); }, 10);
                }

                this.postprocessResults(data, initial);

                postRender();

                this.opts.element.trigger({ type: "select2-loaded", items: data });
            })});
        },

        // abstract
        cancel: function () {
            this.close();
        },

        // abstract
        blur: function () {
            // if selectOnBlur == true, select the currently highlighted option
            if (this.opts.selectOnBlur)
                this.selectHighlighted({noFocus: true});

            this.close();
            this.container.removeClass("select2-container-active");
            // synonymous to .is(':focus'), which is available in jquery >= 1.6
            if (this.search[0] === document.activeElement) { this.search.blur(); }
            this.clearSearch();
            this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus");
        },

        // abstract
        focusSearch: function () {
            focus(this.search);
        },

        // abstract
        selectHighlighted: function (options) {
            if (this._touchMoved) {
              this.clearTouchMoved();
              return;
            }
            var index=this.highlight(),
                highlighted=this.results.find(".select2-highlighted"),
                data = highlighted.closest('.select2-result').data("select2-data");

            if (data) {
                this.highlight(index);
                this.onSelect(data, options);
            } else if (options && options.noFocus) {
                this.close();
            }
        },

        // abstract
        getPlaceholder: function () {
            var placeholderOption;
            return this.opts.element.attr("placeholder") ||
                this.opts.element.attr("data-placeholder") || // jquery 1.4 compat
                this.opts.element.data("placeholder") ||
                this.opts.placeholder ||
                ((placeholderOption = this.getPlaceholderOption()) !== undefined ? placeholderOption.text() : undefined);
        },

        // abstract
        getPlaceholderOption: function() {
            if (this.select) {
                var firstOption = this.select.children('option').first();
                if (this.opts.placeholderOption !== undefined ) {
                    //Determine the placeholder option based on the specified placeholderOption setting
                    return (this.opts.placeholderOption === "first" && firstOption) ||
                           (typeof this.opts.placeholderOption === "function" && this.opts.placeholderOption(this.select));
                } else if ($.trim(firstOption.text()) === "" && firstOption.val() === "") {
                    //No explicit placeholder option specified, use the first if it's blank
                    return firstOption;
                }
            }
        },

        /**
         * Get the desired width for the container element.  This is
         * derived first from option `width` passed to select2, then
         * the inline 'style' on the original element, and finally
         * falls back to the jQuery calculated element width.
         */
        // abstract
        initContainerWidth: function () {
            function resolveContainerWidth() {
                var style, attrs, matches, i, l, attr;

                if (this.opts.width === "off") {
                    return null;
                } else if (this.opts.width === "element"){
                    return this.opts.element.outerWidth(false) === 0 ? 'auto' : this.opts.element.outerWidth(false) + 'px';
                } else if (this.opts.width === "copy" || this.opts.width === "resolve") {
                    // check if there is inline style on the element that contains width
                    style = this.opts.element.attr('style');
                    if (style !== undefined) {
                        attrs = style.split(';');
                        for (i = 0, l = attrs.length; i < l; i = i + 1) {
                            attr = attrs[i].replace(/\s/g, '');
                            matches = attr.match(/^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i);
                            if (matches !== null && matches.length >= 1)
                                return matches[1];
                        }
                    }

                    if (this.opts.width === "resolve") {
                        // next check if css('width') can resolve a width that is percent based, this is sometimes possible
                        // when attached to input type=hidden or elements hidden via css
                        style = this.opts.element.css('width');
                        if (style.indexOf("%") > 0) return style;

                        // finally, fallback on the calculated width of the element
                        return (this.opts.element.outerWidth(false) === 0 ? 'auto' : this.opts.element.outerWidth(false) + 'px');
                    }

                    return null;
                } else if ($.isFunction(this.opts.width)) {
                    return this.opts.width();
                } else {
                    return this.opts.width;
               }
            };

            var width = resolveContainerWidth.call(this);
            if (width !== null) {
                this.container.css("width", width);
            }
        }
    });

    SingleSelect2 = clazz(AbstractSelect2, {

        // single

        createContainer: function () {
            var container = $(document.createElement("div")).attr({
                "class": "select2-container"
            }).html([
                "<a href='javascript:void(0)' class='select2-choice' tabindex='-1'>",
                "   <span class='select2-chosen'>&#160;</span><abbr class='select2-search-choice-close'></abbr>",
                "   <span class='select2-arrow' role='presentation'><i class='icon fontello icon-down-open'></i></span>",
                "</a>",
                "<label for='' class='select2-offscreen'></label>",
                "<input class='select2-focusser select2-offscreen' type='text' aria-haspopup='true' role='button' />",
                "<div class='select2-drop select2-display-none'>",
                "   <div class='select2-search'>",
                "       <label for='' class='select2-offscreen'></label>",
                "       <input type='text' autocomplete='off' autocorrect='off' autocapitalize='off' spellcheck='false' class='select2-input' role='combobox' aria-expanded='true'",
                "       aria-autocomplete='list' />",
                "   </div>",
                "   <ul class='select2-results' role='listbox'>",
                "   </ul>",
                "</div>"].join(""));
            return container;
        },

        // single
        enableInterface: function() {
            if (this.parent.enableInterface.apply(this, arguments)) {
                this.focusser.prop("disabled", !this.isInterfaceEnabled());
            }
        },

        // single
        opening: function () {
            var el, range, len;

            if (this.opts.minimumResultsForSearch >= 0) {
                this.showSearch(true);
            }

            this.parent.opening.apply(this, arguments);

            if (this.showSearchInput !== false) {
                // IE appends focusser.val() at the end of field :/ so we manually insert it at the beginning using a range
                // all other browsers handle this just fine

                this.search.val(this.focusser.val());
            }
            if (this.opts.shouldFocusInput(this)) {
                this.search.focus();
                // move the cursor to the end after focussing, otherwise it will be at the beginning and
                // new text will appear *before* focusser.val()
                el = this.search.get(0);
                if (el.createTextRange) {
                    range = el.createTextRange();
                    range.collapse(false);
                    range.select();
                } else if (el.setSelectionRange) {
                    len = this.search.val().length;
                    el.setSelectionRange(len, len);
                }
            }

            // initializes search's value with nextSearchTerm (if defined by user)
            // ignore nextSearchTerm if the dropdown is opened by the user pressing a letter
            if(this.search.val() === "") {
                if(this.nextSearchTerm != undefined){
                    this.search.val(this.nextSearchTerm);
                    this.search.select();
                }
            }

            this.focusser.prop("disabled", true).val("");
            this.updateResults(true);
            this.opts.element.trigger($.Event("select2-open"));
        },

        // single
        close: function () {
            if (!this.opened()) return;
            this.parent.close.apply(this, arguments);

            this.focusser.prop("disabled", false);

            if (this.opts.shouldFocusInput(this)) {
                this.focusser.focus();
            }
        },

        // single
        focus: function () {
            if (this.opened()) {
                this.close();
            } else {
                this.focusser.prop("disabled", false);
                if (this.opts.shouldFocusInput(this)) {
                    this.focusser.focus();
                }
            }
        },

        // single
        isFocused: function () {
            return this.container.hasClass("select2-container-active");
        },

        // single
        cancel: function () {
            this.parent.cancel.apply(this, arguments);
            this.focusser.prop("disabled", false);

            if (this.opts.shouldFocusInput(this)) {
                this.focusser.focus();
            }
        },

        // single
        destroy: function() {
            $("label[for='" + this.focusser.attr('id') + "']")
                .attr('for', this.opts.element.attr("id"));
            this.parent.destroy.apply(this, arguments);

            cleanupJQueryElements.call(this,
                "selection",
                "focusser"
            );
        },

        // single
        initContainer: function () {

            var selection,
                container = this.container,
                dropdown = this.dropdown,
                idSuffix = nextUid(),
                elementLabel;

            if (this.opts.minimumResultsForSearch < 0) {
                this.showSearch(false);
            } else {
                this.showSearch(true);
            }

            this.selection = selection = container.find(".select2-choice");

            this.focusser = container.find(".select2-focusser");

            // add aria associations
            selection.find(".select2-chosen").attr("id", "select2-chosen-"+idSuffix);
            this.focusser.attr("aria-labelledby", "select2-chosen-"+idSuffix);
            this.results.attr("id", "select2-results-"+idSuffix);
            this.search.attr("aria-owns", "select2-results-"+idSuffix);

            // rewrite labels from original element to focusser
            this.focusser.attr("id", "s2id_autogen"+idSuffix);

            elementLabel = $("label[for='" + this.opts.element.attr("id") + "']");
            this.opts.element.focus(this.bind(function () { this.focus(); }));

            this.focusser.prev()
                .text(elementLabel.text())
                .attr('for', this.focusser.attr('id'));

            // Ensure the original element retains an accessible name
            var originalTitle = this.opts.element.attr("title");
            this.opts.element.attr("title", (originalTitle || elementLabel.text()));

            this.focusser.attr("tabindex", this.elementTabIndex);

            // write label for search field using the label from the focusser element
            this.search.attr("id", this.focusser.attr('id') + '_search');

            this.search.prev()
                .text($("label[for='" + this.focusser.attr('id') + "']").text())
                .attr('for', this.search.attr('id'));

            this.search.on("keydown", this.bind(function (e) {
                if (!this.isInterfaceEnabled()) return;

                // filter 229 keyCodes (input method editor is processing key input)
                if (229 == e.keyCode) return;

                if (e.which === KEY.PAGE_UP || e.which === KEY.PAGE_DOWN) {
                    // prevent the page from scrolling
                    killEvent(e);
                    return;
                }

                switch (e.which) {
                    case KEY.UP:
                    case KEY.DOWN:
                        this.moveHighlight((e.which === KEY.UP) ? -1 : 1);
                        killEvent(e);
                        return;
                    case KEY.ENTER:
                        this.selectHighlighted();
                        killEvent(e);
                        return;
                    case KEY.TAB:
                        this.selectHighlighted({noFocus: true});
                        return;
                    case KEY.ESC:
                        this.cancel(e);
                        killEvent(e);
                        return;
                }
            }));

            this.search.on("blur", this.bind(function(e) {
                // a workaround for chrome to keep the search field focussed when the scroll bar is used to scroll the dropdown.
                // without this the search field loses focus which is annoying
                if (document.activeElement === this.body.get(0)) {
                    window.setTimeout(this.bind(function() {
                        if (this.opened()) {
                            this.search.focus();
                        }
                    }), 0);
                }
            }));

            this.focusser.on("keydown", this.bind(function (e) {
                if (!this.isInterfaceEnabled()) return;

                if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e) || e.which === KEY.ESC) {
                    return;
                }

                if (this.opts.openOnEnter === false && e.which === KEY.ENTER) {
                    killEvent(e);
                    return;
                }

                if (e.which == KEY.DOWN || e.which == KEY.UP
                    || (e.which == KEY.ENTER && this.opts.openOnEnter)) {

                    if (e.altKey || e.ctrlKey || e.shiftKey || e.metaKey) return;

                    this.open();
                    killEvent(e);
                    return;
                }

                if (e.which == KEY.DELETE || e.which == KEY.BACKSPACE) {
                    if (this.opts.allowClear) {
                        this.clear();
                    }
                    killEvent(e);
                    return;
                }
            }));


            installKeyUpChangeEvent(this.focusser);
            this.focusser.on("keyup-change input", this.bind(function(e) {
                if (this.opts.minimumResultsForSearch >= 0) {
                    e.stopPropagation();
                    if (this.opened()) return;
                    this.open();
                }
            }));

            selection.on("mousedown touchstart", "abbr", this.bind(function (e) {
                if (!this.isInterfaceEnabled()) {
                    return;
                }

                this.clear();
                killEventImmediately(e);
                this.close();

                if (this.selection) {
                    this.selection.focus();
                }
            }));

            selection.on("mousedown touchstart", this.bind(function (e) {
                // Prevent IE from generating a click event on the body
                reinsertElement(selection);

                if (!this.container.hasClass("select2-container-active")) {
                    this.opts.element.trigger($.Event("select2-focus"));
                }

                if (this.opened()) {
                    this.close();
                } else if (this.isInterfaceEnabled()) {
                    this.open();
                }

                killEvent(e);
            }));

            dropdown.on("mousedown touchstart", this.bind(function() {
                if (this.opts.shouldFocusInput(this)) {
                    this.search.focus();
                }
            }));

            selection.on("focus", this.bind(function(e) {
                killEvent(e);
            }));

            this.focusser.on("focus", this.bind(function(){
                if (!this.container.hasClass("select2-container-active")) {
                    this.opts.element.trigger($.Event("select2-focus"));
                }
                this.container.addClass("select2-container-active");
            })).on("blur", this.bind(function() {
                if (!this.opened()) {
                    this.container.removeClass("select2-container-active");
                    this.opts.element.trigger($.Event("select2-blur"));
                }
            }));
            this.search.on("focus", this.bind(function(){
                if (!this.container.hasClass("select2-container-active")) {
                    this.opts.element.trigger($.Event("select2-focus"));
                }
                this.container.addClass("select2-container-active");
            }));

            this.initContainerWidth();
            this.opts.element.hide();
            this.setPlaceholder();

        },

        // single
        clear: function(triggerChange) {
            var data=this.selection.data("select2-data");
            if (data) { // guard against queued quick consecutive clicks
                var evt = $.Event("select2-clearing");
                this.opts.element.trigger(evt);
                if (evt.isDefaultPrevented()) {
                    return;
                }
                var placeholderOption = this.getPlaceholderOption();
                this.opts.element.val(placeholderOption ? placeholderOption.val() : "");
                this.selection.find(".select2-chosen").empty();
                this.selection.removeData("select2-data");
                this.setPlaceholder();

                if (triggerChange !== false){
                    this.opts.element.trigger({ type: "select2-removed", val: this.id(data), choice: data });
                    this.triggerChange({removed:data});
                }
            }
        },

        /**
         * Sets selection based on source element's value
         */
        // single
        initSelection: function () {
            var selected;
            if (this.isPlaceholderOptionSelected()) {
                this.updateSelection(null);
                this.close();
                this.setPlaceholder();
            } else {
                var self = this;
                this.opts.initSelection.call(null, this.opts.element, function(selected){
                    if (selected !== undefined && selected !== null) {
                        self.updateSelection(selected);
                        self.close();
                        self.setPlaceholder();
                        self.nextSearchTerm = self.opts.nextSearchTerm(selected, self.search.val());
                    }
                });
            }
        },

        isPlaceholderOptionSelected: function() {
            var placeholderOption;
            if (this.getPlaceholder() === undefined) return false; // no placeholder specified so no option should be considered
            return ((placeholderOption = this.getPlaceholderOption()) !== undefined && placeholderOption.prop("selected"))
                || (this.opts.element.val() === "")
                || (this.opts.element.val() === undefined)
                || (this.opts.element.val() === null);
        },

        // single
        prepareOpts: function () {
            var opts = this.parent.prepareOpts.apply(this, arguments),
                self=this;

            if (opts.element.get(0).tagName.toLowerCase() === "select") {
                // install the selection initializer
                opts.initSelection = function (element, callback) {
                    var selected = element.find("option").filter(function() { return this.selected && !this.disabled });
                    // a single select box always has a value, no need to null check 'selected'
                    callback(self.optionToData(selected));
                };
            } else if ("data" in opts) {
                // install default initSelection when applied to hidden input and data is local
                opts.initSelection = opts.initSelection || function (element, callback) {
                    var id = element.val();
                    //search in data by id, storing the actual matching item
                    var match = null;
                    opts.query({
                        matcher: function(term, text, el){
                            var is_match = equal(id, opts.id(el));
                            if (is_match) {
                                match = el;
                            }
                            return is_match;
                        },
                        callback: !$.isFunction(callback) ? $.noop : function() {
                            callback(match);
                        }
                    });
                };
            }

            return opts;
        },

        // single
        getPlaceholder: function() {
            // if a placeholder is specified on a single select without a valid placeholder option ignore it
            if (this.select) {
                if (this.getPlaceholderOption() === undefined) {
                    return undefined;
                }
            }

            return this.parent.getPlaceholder.apply(this, arguments);
        },

        // single
        setPlaceholder: function () {
            var placeholder = this.getPlaceholder();

            if (this.isPlaceholderOptionSelected() && placeholder !== undefined) {

                // check for a placeholder option if attached to a select
                if (this.select && this.getPlaceholderOption() === undefined) return;

                this.selection.find(".select2-chosen").html(this.opts.escapeMarkup(placeholder));

                this.selection.addClass("select2-default");

                this.container.removeClass("select2-allowclear");
            }
        },

        // single
        postprocessResults: function (data, initial, noHighlightUpdate) {
            var selected = 0, self = this, showSearchInput = true;

            // find the selected element in the result list

            this.findHighlightableChoices().each2(function (i, elm) {
                if (equal(self.id(elm.data("select2-data")), self.opts.element.val())) {
                    selected = i;
                    return false;
                }
            });

            // and highlight it
            if (noHighlightUpdate !== false) {
                if (initial === true && selected >= 0) {
                    this.highlight(selected);
                } else {
                    this.highlight(0);
                }
            }

            // hide the search box if this is the first we got the results and there are enough of them for search

            if (initial === true) {
                var min = this.opts.minimumResultsForSearch;
                if (min >= 0) {
                    this.showSearch(countResults(data.results) >= min);
                }
            }
        },

        // single
        showSearch: function(showSearchInput) {
            if (this.showSearchInput === showSearchInput) return;

            this.showSearchInput = showSearchInput;

            this.dropdown.find(".select2-search").toggleClass("select2-search-hidden", !showSearchInput);
            this.dropdown.find(".select2-search").toggleClass("select2-offscreen", !showSearchInput);
            //add "select2-with-searchbox" to the container if search box is shown
            $(this.dropdown, this.container).toggleClass("select2-with-searchbox", showSearchInput);
        },

        // single
        onSelect: function (data, options) {

            if (!this.triggerSelect(data)) { return; }

            var old = this.opts.element.val(),
                oldData = this.data();

            this.opts.element.val(this.id(data));
            this.updateSelection(data);

            this.opts.element.trigger({ type: "select2-selected", val: this.id(data), choice: data });

            this.nextSearchTerm = this.opts.nextSearchTerm(data, this.search.val());
            this.close();

            if ((!options || !options.noFocus) && this.opts.shouldFocusInput(this)) {
                this.focusser.focus();
            }

            if (!equal(old, this.id(data))) {
                this.triggerChange({ added: data, removed: oldData });
            }
        },

        // single
        updateSelection: function (data) {

            var container=this.selection.find(".select2-chosen"), formatted, cssClass;

            this.selection.data("select2-data", data);

            container.empty();
            if (data !== null) {
                formatted=this.opts.formatSelection(data, container, this.opts.escapeMarkup);
            }
            if (formatted !== undefined) {
                container.append(formatted);
            }
            cssClass=this.opts.formatSelectionCssClass(data, container);
            if (cssClass !== undefined) {
                container.addClass(cssClass);
            }

            this.selection.removeClass("select2-default");

            if (this.opts.allowClear && this.getPlaceholder() !== undefined) {
                this.container.addClass("select2-allowclear");
            }
        },

        // single
        val: function () {
            var val,
                triggerChange = false,
                data = null,
                self = this,
                oldData = this.data();

            if (arguments.length === 0) {
                return this.opts.element.val();
            }

            val = arguments[0];

            if (arguments.length > 1) {
                triggerChange = arguments[1];
            }

            if (this.select) {
                this.select
                    .val(val)
                    .find("option").filter(function() { return this.selected }).each2(function (i, elm) {
                        data = self.optionToData(elm);
                        return false;
                    });
                this.updateSelection(data);
                this.setPlaceholder();
                if (triggerChange) {
                    this.triggerChange({added: data, removed:oldData});
                }
            } else {
                // val is an id. !val is true for [undefined,null,'',0] - 0 is legal
                if (!val && val !== 0) {
                    this.clear(triggerChange);
                    return;
                }
                if (this.opts.initSelection === undefined) {
                    throw new Error("cannot call val() if initSelection() is not defined");
                }
                this.opts.element.val(val);
                this.opts.initSelection(this.opts.element, function(data){
                    self.opts.element.val(!data ? "" : self.id(data));
                    self.updateSelection(data);
                    self.setPlaceholder();
                    if (triggerChange) {
                        self.triggerChange({added: data, removed:oldData});
                    }
                });
            }
        },

        // single
        clearSearch: function () {
            this.search.val("");
            this.focusser.val("");
        },

        // single
        data: function(value) {
            var data,
                triggerChange = false;

            if (arguments.length === 0) {
                data = this.selection.data("select2-data");
                if (data == undefined) data = null;
                return data;
            } else {
                if (arguments.length > 1) {
                    triggerChange = arguments[1];
                }
                if (!value) {
                    this.clear(triggerChange);
                } else {
                    data = this.data();
                    this.opts.element.val(!value ? "" : this.id(value));
                    this.updateSelection(value);
                    if (triggerChange) {
                        this.triggerChange({added: value, removed:data});
                    }
                }
            }
        }
    });

    MultiSelect2 = clazz(AbstractSelect2, {

        // multi
        createContainer: function () {
            var container = $(document.createElement("div")).attr({
                "class": "select2-container select2-container-multi"
            }).html([
                "<ul class='select2-choices'>",
                "  <li class='select2-search-field'>",
                "    <label for='' class='select2-offscreen'></label>",
                "    <input type='text' autocomplete='off' autocorrect='off' autocapitalize='off' spellcheck='false' class='select2-input'>",
                "  </li>",
                "</ul>",
                "<div class='select2-drop select2-drop-multi select2-display-none'>",
                "   <ul class='select2-results'>",
                "   </ul>",
                "</div>"].join(""));
            return container;
        },

        // multi
        prepareOpts: function () {
            var opts = this.parent.prepareOpts.apply(this, arguments),
                self=this;

            // TODO validate placeholder is a string if specified
            if (opts.element.get(0).tagName.toLowerCase() === "select") {
                // install the selection initializer
                opts.initSelection = function (element, callback) {

                    var data = [];

                    element.find("option").filter(function() { return this.selected && !this.disabled }).each2(function (i, elm) {
                        data.push(self.optionToData(elm));
                    });
                    callback(data);
                };
            } else if ("data" in opts) {
                // install default initSelection when applied to hidden input and data is local
                opts.initSelection = opts.initSelection || function (element, callback) {
                    var ids = splitVal(element.val(), opts.separator, opts.transformVal);
                    //search in data by array of ids, storing matching items in a list
                    var matches = [];
                    opts.query({
                        matcher: function(term, text, el){
                            var is_match = $.grep(ids, function(id) {
                                return equal(id, opts.id(el));
                            }).length;
                            if (is_match) {
                                matches.push(el);
                            }
                            return is_match;
                        },
                        callback: !$.isFunction(callback) ? $.noop : function() {
                            // reorder matches based on the order they appear in the ids array because right now
                            // they are in the order in which they appear in data array
                            var ordered = [];
                            for (var i = 0; i < ids.length; i++) {
                                var id = ids[i];
                                for (var j = 0; j < matches.length; j++) {
                                    var match = matches[j];
                                    if (equal(id, opts.id(match))) {
                                        ordered.push(match);
                                        matches.splice(j, 1);
                                        break;
                                    }
                                }
                            }
                            callback(ordered);
                        }
                    });
                };
            }

            return opts;
        },

        // multi
        selectChoice: function (choice) {

            var selected = this.container.find(".select2-search-choice-focus");
            if (selected.length && choice && choice[0] == selected[0]) {

            } else {
                if (selected.length) {
                    this.opts.element.trigger("choice-deselected", selected);
                }
                selected.removeClass("select2-search-choice-focus");
                if (choice && choice.length) {
                    this.close();
                    choice.addClass("select2-search-choice-focus");
                    this.opts.element.trigger("choice-selected", choice);
                }
            }
        },

        // multi
        destroy: function() {
            $("label[for='" + this.search.attr('id') + "']")
                .attr('for', this.opts.element.attr("id"));
            this.parent.destroy.apply(this, arguments);

            cleanupJQueryElements.call(this,
                "searchContainer",
                "selection"
            );
        },

        // multi
        initContainer: function () {

            var selector = ".select2-choices", selection;

            this.searchContainer = this.container.find(".select2-search-field");
            this.selection = selection = this.container.find(selector);

            var _this = this;
            this.selection.on("click", ".select2-container:not(.select2-container-disabled) .select2-search-choice:not(.select2-locked)", function (e) {
                _this.search[0].focus();
                _this.selectChoice($(this));
            });

            // rewrite labels from original element to focusser
            this.search.attr("id", "s2id_autogen"+nextUid());

            this.search.prev()
                .text($("label[for='" + this.opts.element.attr("id") + "']").text())
                .attr('for', this.search.attr('id'));
            this.opts.element.focus(this.bind(function () { this.focus(); }));

            this.search.on("input paste", this.bind(function() {
                if (this.search.attr('placeholder') && this.search.val().length == 0) return;
                if (!this.isInterfaceEnabled()) return;
                if (!this.opened()) {
                    this.open();
                }
            }));

            this.search.attr("tabindex", this.elementTabIndex);

            this.keydowns = 0;
            this.search.on("keydown", this.bind(function (e) {
                if (!this.isInterfaceEnabled()) return;

                ++this.keydowns;
                var selected = selection.find(".select2-search-choice-focus");
                var prev = selected.prev(".select2-search-choice:not(.select2-locked)");
                var next = selected.next(".select2-search-choice:not(.select2-locked)");
                var pos = getCursorInfo(this.search);

                if (selected.length &&
                    (e.which == KEY.LEFT || e.which == KEY.RIGHT || e.which == KEY.BACKSPACE || e.which == KEY.DELETE || e.which == KEY.ENTER)) {
                    var selectedChoice = selected;
                    if (e.which == KEY.LEFT && prev.length) {
                        selectedChoice = prev;
                    }
                    else if (e.which == KEY.RIGHT) {
                        selectedChoice = next.length ? next : null;
                    }
                    else if (e.which === KEY.BACKSPACE) {
                        if (this.unselect(selected.first())) {
                            this.search.width(10);
                            selectedChoice = prev.length ? prev : next;
                        }
                    } else if (e.which == KEY.DELETE) {
                        if (this.unselect(selected.first())) {
                            this.search.width(10);
                            selectedChoice = next.length ? next : null;
                        }
                    } else if (e.which == KEY.ENTER) {
                        selectedChoice = null;
                    }

                    this.selectChoice(selectedChoice);
                    killEvent(e);
                    if (!selectedChoice || !selectedChoice.length) {
                        this.open();
                    }
                    return;
                } else if (((e.which === KEY.BACKSPACE && this.keydowns == 1)
                    || e.which == KEY.LEFT) && (pos.offset == 0 && !pos.length)) {

                    this.selectChoice(selection.find(".select2-search-choice:not(.select2-locked)").last());
                    killEvent(e);
                    return;
                } else {
                    this.selectChoice(null);
                }

                if (this.opened()) {
                    switch (e.which) {
                    case KEY.UP:
                    case KEY.DOWN:
                        this.moveHighlight((e.which === KEY.UP) ? -1 : 1);
                        killEvent(e);
                        return;
                    case KEY.ENTER:
                        this.selectHighlighted();
                        killEvent(e);
                        return;
                    case KEY.TAB:
                        this.selectHighlighted({noFocus:true});
                        this.close();
                        return;
                    case KEY.ESC:
                        this.cancel(e);
                        killEvent(e);
                        return;
                    }
                }

                if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e)
                 || e.which === KEY.BACKSPACE || e.which === KEY.ESC) {
                    return;
                }

                if (e.which === KEY.ENTER) {
                    if (this.opts.openOnEnter === false) {
                        return;
                    } else if (e.altKey || e.ctrlKey || e.shiftKey || e.metaKey) {
                        return;
                    }
                }

                this.open();

                if (e.which === KEY.PAGE_UP || e.which === KEY.PAGE_DOWN) {
                    // prevent the page from scrolling
                    killEvent(e);
                }

                if (e.which === KEY.ENTER) {
                    // prevent form from being submitted
                    killEvent(e);
                }

            }));

            this.search.on("keyup", this.bind(function (e) {
                this.keydowns = 0;
                this.resizeSearch();
            })
            );

            this.search.on("blur", this.bind(function(e) {
                this.container.removeClass("select2-container-active");
                this.search.removeClass("select2-focused");
                this.selectChoice(null);
                if (!this.opened()) this.clearSearch();
                e.stopImmediatePropagation();
                this.opts.element.trigger($.Event("select2-blur"));
            }));

            this.container.on("click", selector, this.bind(function (e) {
                if (!this.isInterfaceEnabled()) return;
                if ($(e.target).closest(".select2-search-choice").length > 0) {
                    // clicked inside a select2 search choice, do not open
                    return;
                }
                this.selectChoice(null);
                this.clearPlaceholder();
                if (!this.container.hasClass("select2-container-active")) {
                    this.opts.element.trigger($.Event("select2-focus"));
                }
                this.open();
                this.focusSearch();
                e.preventDefault();
            }));

            this.container.on("focus", selector, this.bind(function () {
                if (!this.isInterfaceEnabled()) return;
                if (!this.container.hasClass("select2-container-active")) {
                    this.opts.element.trigger($.Event("select2-focus"));
                }
                this.container.addClass("select2-container-active");
                this.dropdown.addClass("select2-drop-active");
                this.clearPlaceholder();
            }));

            this.initContainerWidth();
            this.opts.element.hide();

            // set the placeholder if necessary
            this.clearSearch();
        },

        // multi
        enableInterface: function() {
            if (this.parent.enableInterface.apply(this, arguments)) {
                this.search.prop("disabled", !this.isInterfaceEnabled());
            }
        },

        // multi
        initSelection: function () {
            var data;
            if (this.opts.element.val() === "" && this.opts.element.text() === "") {
                this.updateSelection([]);
                this.close();
                // set the placeholder if necessary
                this.clearSearch();
            }
            if (this.select || this.opts.element.val() !== "") {
                var self = this;
                this.opts.initSelection.call(null, this.opts.element, function(data){
                    if (data !== undefined && data !== null) {
                        self.updateSelection(data);
                        self.close();
                        // set the placeholder if necessary
                        self.clearSearch();
                    }
                });
            }
        },

        // multi
        clearSearch: function () {
            var placeholder = this.getPlaceholder(),
                maxWidth = this.getMaxSearchWidth();

            if (placeholder !== undefined  && this.getVal().length === 0 && this.search.hasClass("select2-focused") === false) {
                this.search.val(placeholder).addClass("select2-default");
                // stretch the search box to full width of the container so as much of the placeholder is visible as possible
                // we could call this.resizeSearch(), but we do not because that requires a sizer and we do not want to create one so early because of a firefox bug, see #944
                this.search.width(maxWidth > 0 ? maxWidth : this.container.css("width"));
            } else {
                this.search.val("").width(10);
            }
        },

        // multi
        clearPlaceholder: function () {
            if (this.search.hasClass("select2-default")) {
                this.search.val("").removeClass("select2-default");
            }
        },

        // multi
        opening: function () {
            this.clearPlaceholder(); // should be done before super so placeholder is not used to search
            this.resizeSearch();

            this.parent.opening.apply(this, arguments);

            this.focusSearch();

            // initializes search's value with nextSearchTerm (if defined by user)
            // ignore nextSearchTerm if the dropdown is opened by the user pressing a letter
            if(this.search.val() === "") {
                if(this.nextSearchTerm != undefined){
                    this.search.val(this.nextSearchTerm);
                    this.search.select();
                }
            }

            this.updateResults(true);
            if (this.opts.shouldFocusInput(this)) {
                this.search.focus();
            }
            this.opts.element.trigger($.Event("select2-open"));
        },

        // multi
        close: function () {
            if (!this.opened()) return;
            this.parent.close.apply(this, arguments);
        },

        // multi
        focus: function () {
            this.close();
            this.search.focus();
        },

        // multi
        isFocused: function () {
            return this.search.hasClass("select2-focused");
        },

        // multi
        updateSelection: function (data) {
            var ids = [], filtered = [], self = this;

            // filter out duplicates
            $(data).each(function () {
                if (indexOf(self.id(this), ids) < 0) {
                    ids.push(self.id(this));
                    filtered.push(this);
                }
            });
            data = filtered;

            this.selection.find(".select2-search-choice").remove();
            $(data).each(function () {
                self.addSelectedChoice(this);
            });
            self.postprocessResults();
        },

        // multi
        tokenize: function() {
            var input = this.search.val();
            input = this.opts.tokenizer.call(this, input, this.data(), this.bind(this.onSelect), this.opts);
            if (input != null && input != undefined) {
                this.search.val(input);
                if (input.length > 0) {
                    this.open();
                }
            }

        },

        // multi
        onSelect: function (data, options) {

            if (!this.triggerSelect(data) || data.text === "") { return; }

            this.addSelectedChoice(data);

            this.opts.element.trigger({ type: "selected", val: this.id(data), choice: data });

            // keep track of the search's value before it gets cleared
            this.nextSearchTerm = this.opts.nextSearchTerm(data, this.search.val());

            this.clearSearch();
            this.updateResults();

            if (this.select || !this.opts.closeOnSelect) this.postprocessResults(data, false, this.opts.closeOnSelect===true);

            if (this.opts.closeOnSelect) {
                this.close();
                this.search.width(10);
            } else {
                if (this.countSelectableResults()>0) {
                    this.search.width(10);
                    this.resizeSearch();
                    if (this.getMaximumSelectionSize() > 0 && this.val().length >= this.getMaximumSelectionSize()) {
                        // if we reached max selection size repaint the results so choices
                        // are replaced with the max selection reached message
                        this.updateResults(true);
                    } else {
                        // initializes search's value with nextSearchTerm and update search result
                        if(this.nextSearchTerm != undefined){
                            this.search.val(this.nextSearchTerm);
                            this.updateResults();
                            this.search.select();
                        }
                    }
                    this.positionDropdown();
                } else {
                    // if nothing left to select close
                    this.close();
                    this.search.width(10);
                }
            }

            // since its not possible to select an element that has already been
            // added we do not need to check if this is a new element before firing change
            this.triggerChange({ added: data });

            if (!options || !options.noFocus)
                this.focusSearch();
        },

        // multi
        cancel: function () {
            this.close();
            this.focusSearch();
        },

        addSelectedChoice: function (data) {
            var enableChoice = !data.locked,
                enabledItem = $(
                    "<li class='select2-search-choice'>" +
                    "    <div></div>" +
                    "    <a href='#' class='select2-search-choice-close' tabindex='-1'></a>" +
                    "</li>"),
                disabledItem = $(
                    "<li class='select2-search-choice select2-locked'>" +
                    "<div></div>" +
                    "</li>");
            var choice = enableChoice ? enabledItem : disabledItem,
                id = this.id(data),
                val = this.getVal(),
                formatted,
                cssClass;

            formatted=this.opts.formatSelection(data, choice.find("div"), this.opts.escapeMarkup);
            if (formatted != undefined) {
                choice.find("div").replaceWith($("<div></div>").html(formatted));
            }
            cssClass=this.opts.formatSelectionCssClass(data, choice.find("div"));
            if (cssClass != undefined) {
                choice.addClass(cssClass);
            }

            if(enableChoice){
              choice.find(".select2-search-choice-close")
                  .on("mousedown", killEvent)
                  .on("click dblclick", this.bind(function (e) {
                  if (!this.isInterfaceEnabled()) return;

                  this.unselect($(e.target));
                  this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus");
                  killEvent(e);
                  this.close();
                  this.focusSearch();
              })).on("focus", this.bind(function () {
                  if (!this.isInterfaceEnabled()) return;
                  this.container.addClass("select2-container-active");
                  this.dropdown.addClass("select2-drop-active");
              }));
            }

            choice.data("select2-data", data);
            choice.insertBefore(this.searchContainer);

            val.push(id);
            this.setVal(val);
        },

        // multi
        unselect: function (selected) {
            var val = this.getVal(),
                data,
                index;
            selected = selected.closest(".select2-search-choice");

            if (selected.length === 0) {
                throw "Invalid argument: " + selected + ". Must be .select2-search-choice";
            }

            data = selected.data("select2-data");

            if (!data) {
                // prevent a race condition when the 'x' is clicked really fast repeatedly the event can be queued
                // and invoked on an element already removed
                return;
            }

            var evt = $.Event("select2-removing");
            evt.val = this.id(data);
            evt.choice = data;
            this.opts.element.trigger(evt);

            if (evt.isDefaultPrevented()) {
                return false;
            }

            while((index = indexOf(this.id(data), val)) >= 0) {
                val.splice(index, 1);
                this.setVal(val);
                if (this.select) this.postprocessResults();
            }

            selected.remove();

            this.opts.element.trigger({ type: "select2-removed", val: this.id(data), choice: data });
            this.triggerChange({ removed: data });

            return true;
        },

        // multi
        postprocessResults: function (data, initial, noHighlightUpdate) {
            var val = this.getVal(),
                choices = this.results.find(".select2-result"),
                compound = this.results.find(".select2-result-with-children"),
                self = this;

            choices.each2(function (i, choice) {
                var id = self.id(choice.data("select2-data"));
                if (indexOf(id, val) >= 0) {
                    choice.addClass("select2-selected");
                    // mark all children of the selected parent as selected
                    choice.find(".select2-result-selectable").addClass("select2-selected");
                }
            });

            compound.each2(function(i, choice) {
                // hide an optgroup if it doesn't have any selectable children
                if (!choice.is('.select2-result-selectable')
                    && choice.find(".select2-result-selectable:not(.select2-selected)").length === 0) {
                    choice.addClass("select2-selected");
                }
            });

            if (this.highlight() == -1 && noHighlightUpdate !== false && this.opts.closeOnSelect === true){
                self.highlight(0);
            }

            //If all results are chosen render formatNoMatches
            if(!this.opts.createSearchChoice && !choices.filter('.select2-result:not(.select2-selected)').length > 0){
                if(!data || data && !data.more && this.results.find(".select2-no-results").length === 0) {
                    if (checkFormatter(self.opts.formatNoMatches, "formatNoMatches")) {
                        this.results.append("<li class='select2-no-results'>" + evaluate(self.opts.formatNoMatches, self.opts.element, self.search.val()) + "</li>");
                    }
                }
            }

        },

        // multi
        getMaxSearchWidth: function() {
            return this.selection.width() - getSideBorderPadding(this.search);
        },

        // multi
        resizeSearch: function () {
            var minimumWidth, left, maxWidth, containerLeft, searchWidth,
                sideBorderPadding = getSideBorderPadding(this.search);

            minimumWidth = measureTextWidth(this.search) + 10;

            left = this.search.offset().left;

            maxWidth = this.selection.width();
            containerLeft = this.selection.offset().left;

            searchWidth = maxWidth - (left - containerLeft) - sideBorderPadding;

            if (searchWidth < minimumWidth) {
                searchWidth = maxWidth - sideBorderPadding;
            }

            if (searchWidth < 40) {
                searchWidth = maxWidth - sideBorderPadding;
            }

            if (searchWidth <= 0) {
              searchWidth = minimumWidth;
            }

            this.search.width(Math.floor(searchWidth));
        },

        // multi
        getVal: function () {
            var val;
            if (this.select) {
                val = this.select.val();
                return val === null ? [] : val;
            } else {
                val = this.opts.element.val();
                return splitVal(val, this.opts.separator, this.opts.transformVal);
            }
        },

        // multi
        setVal: function (val) {
            var unique;
            if (this.select) {
                this.select.val(val);
            } else {
                unique = [];
                // filter out duplicates
                $(val).each(function () {
                    if (indexOf(this, unique) < 0) unique.push(this);
                });
                this.opts.element.val(unique.length === 0 ? "" : unique.join(this.opts.separator));
            }
        },

        // multi
        buildChangeDetails: function (old, current) {
            var current = current.slice(0),
                old = old.slice(0);

            // remove intersection from each array
            for (var i = 0; i < current.length; i++) {
                for (var j = 0; j < old.length; j++) {
                    if (equal(this.opts.id(current[i]), this.opts.id(old[j]))) {
                        current.splice(i, 1);
                        if(i>0){
                            i--;
                        }
                        old.splice(j, 1);
                        j--;
                    }
                }
            }

            return {added: current, removed: old};
        },


        // multi
        val: function (val, triggerChange) {
            var oldData, self=this;

            if (arguments.length === 0) {
                return this.getVal();
            }

            oldData=this.data();
            if (!oldData.length) oldData=[];

            // val is an id. !val is true for [undefined,null,'',0] - 0 is legal
            if (!val && val !== 0) {
                this.opts.element.val("");
                this.updateSelection([]);
                this.clearSearch();
                if (triggerChange) {
                    this.triggerChange({added: this.data(), removed: oldData});
                }
                return;
            }

            // val is a list of ids
            this.setVal(val);

            if (this.select) {
                this.opts.initSelection(this.select, this.bind(this.updateSelection));
                if (triggerChange) {
                    this.triggerChange(this.buildChangeDetails(oldData, this.data()));
                }
            } else {
                if (this.opts.initSelection === undefined) {
                    throw new Error("val() cannot be called if initSelection() is not defined");
                }

                this.opts.initSelection(this.opts.element, function(data){
                    var ids=$.map(data, self.id);
                    self.setVal(ids);
                    self.updateSelection(data);
                    self.clearSearch();
                    if (triggerChange) {
                        self.triggerChange(self.buildChangeDetails(oldData, self.data()));
                    }
                });
            }
            this.clearSearch();
        },

        // multi
        onSortStart: function() {
            if (this.select) {
                throw new Error("Sorting of elements is not supported when attached to <select>. Attach to <input type='hidden'/> instead.");
            }

            // collapse search field into 0 width so its container can be collapsed as well
            this.search.width(0);
            // hide the container
            this.searchContainer.hide();
        },

        // multi
        onSortEnd:function() {

            var val=[], self=this;

            // show search and move it to the end of the list
            this.searchContainer.show();
            // make sure the search container is the last item in the list
            this.searchContainer.appendTo(this.searchContainer.parent());
            // since we collapsed the width in dragStarted, we resize it here
            this.resizeSearch();

            // update selection
            this.selection.find(".select2-search-choice").each(function() {
                val.push(self.opts.id($(this).data("select2-data")));
            });
            this.setVal(val);
            this.triggerChange();
        },

        // multi
        data: function(values, triggerChange) {
            var self=this, ids, old;
            if (arguments.length === 0) {
                 return this.selection
                     .children(".select2-search-choice")
                     .map(function() { return $(this).data("select2-data"); })
                     .get();
            } else {
                old = this.data();
                if (!values) { values = []; }
                ids = $.map(values, function(e) { return self.opts.id(e); });
                this.setVal(ids);
                this.updateSelection(values);
                this.clearSearch();
                if (triggerChange) {
                    this.triggerChange(this.buildChangeDetails(old, this.data()));
                }
            }
        }
    });

    $.fn.select2 = function () {

        var args = Array.prototype.slice.call(arguments, 0),
            opts,
            select2,
            method, value, multiple,
            allowedMethods = ["val", "destroy", "opened", "open", "close", "focus", "isFocused", "container", "dropdown", "onSortStart", "onSortEnd", "enable", "disable", "readonly", "positionDropdown", "data", "search"],
            valueMethods = ["opened", "isFocused", "container", "dropdown"],
            propertyMethods = ["val", "data"],
            methodsMap = { search: "externalSearch" };

        this.each(function () {
            if (args.length === 0 || typeof(args[0]) === "object") {
                opts = args.length === 0 ? {} : $.extend({}, args[0]);
                opts.element = $(this);

                if (opts.element.get(0).tagName.toLowerCase() === "select") {
                    multiple = opts.element.prop("multiple");
                } else {
                    multiple = opts.multiple || false;
                    if ("tags" in opts) {opts.multiple = multiple = true;}
                }

                select2 = multiple ? new window.Select2["class"].multi() : new window.Select2["class"].single();
                select2.init(opts);
            } else if (typeof(args[0]) === "string") {

                if (indexOf(args[0], allowedMethods) < 0) {
                    throw "Unknown method: " + args[0];
                }

                value = undefined;
                select2 = $(this).data("select2");
                if (select2 === undefined) return;

                method=args[0];

                if (method === "container") {
                    value = select2.container;
                } else if (method === "dropdown") {
                    value = select2.dropdown;
                } else {
                    if (methodsMap[method]) method = methodsMap[method];

                    value = select2[method].apply(select2, args.slice(1));
                }
                if (indexOf(args[0], valueMethods) >= 0
                    || (indexOf(args[0], propertyMethods) >= 0 && args.length == 1)) {
                    return false; // abort the iteration, ready to return first matched value
                }
            } else {
                throw "Invalid arguments to select2 plugin: " + args;
            }
        });
        return (value === undefined) ? this : value;
    };

    // plugin defaults, accessible to users
    $.fn.select2.defaults = {
        width: "copy",
        loadMorePadding: 0,
        closeOnSelect: true,
        openOnEnter: true,
        containerCss: {},
        dropdownCss: {},
        containerCssClass: "",
        dropdownCssClass: "",
        formatResult: function(result, container, query, escapeMarkup) {
            var markup=[];
            markMatch(this.text(result), query.term, markup, escapeMarkup);
            return markup.join("");
        },
        transformVal: function(val) {
            return $.trim(val);
        },
        formatSelection: function (data, container, escapeMarkup) {
            return data ? escapeMarkup(this.text(data)) : undefined;
        },
        sortResults: function (results, container, query) {
            return results;
        },
        formatResultCssClass: function(data) {return data.css;},
        formatSelectionCssClass: function(data, container) {return undefined;},
        minimumResultsForSearch: 0,
        minimumInputLength: 0,
        maximumInputLength: null,
        maximumSelectionSize: 0,
        id: function (e) { return e == undefined ? null : e.id; },
        text: function (e) {
          if (e && this.data && this.data.text) {
            if ($.isFunction(this.data.text)) {
              return this.data.text(e);
            } else {
              return e[this.data.text];
            }
          } else {
            return e.text;
          }
        },
        matcher: function(term, text) {
            return stripDiacritics(''+text).toUpperCase().indexOf(stripDiacritics(''+term).toUpperCase()) >= 0;
        },
        separator: ",",
        tokenSeparators: [],
        tokenizer: defaultTokenizer,
        escapeMarkup: defaultEscapeMarkup,
        blurOnChange: false,
        selectOnBlur: false,
        adaptContainerCssClass: function(c) { return c; },
        adaptDropdownCssClass: function(c) { return null; },
        nextSearchTerm: function(selectedObject, currentSearchTerm) { return undefined; },
        searchInputPlaceholder: '',
        createSearchChoicePosition: 'top',
        shouldFocusInput: function (instance) {
            // Attempt to detect touch devices
            var supportsTouchEvents = (('ontouchstart' in window) ||
                                       (navigator.msMaxTouchPoints > 0));

            // Only devices which support touch events should be special cased
            if (!supportsTouchEvents) {
                return true;
            }

            // Never focus the input if search is disabled
            if (instance.opts.minimumResultsForSearch < 0) {
                return false;
            }

            return true;
        }
    };

    $.fn.select2.locales = [];

    $.fn.select2.locales['en'] = {
         formatMatches: function (matches) { if (matches === 1) { return "One result is available, press enter to select it."; } return matches + " results are available, use up and down arrow keys to navigate."; },
         formatNoMatches: function () { return "No matches found"; },
         formatAjaxError: function (jqXHR, textStatus, errorThrown) { return "Loading failed"; },
         formatInputTooShort: function (input, min) { var n = min - input.length; return "Please enter " + n + " or more character" + (n == 1 ? "" : "s"); },
         formatInputTooLong: function (input, max) { var n = input.length - max; return "Please delete " + n + " character" + (n == 1 ? "" : "s"); },
         formatSelectionTooBig: function (limit) { return "You can only select " + limit + " item" + (limit == 1 ? "" : "s"); },
         formatLoadMore: function (pageNumber) { return "Loading more results…"; },
         formatSearching: function () { return "Searching…"; }
    };

    $.extend($.fn.select2.defaults, $.fn.select2.locales['en']);

    $.fn.select2.ajaxDefaults = {
        transport: $.ajax,
        params: {
            type: "GET",
            cache: false,
            dataType: "json"
        }
    };

    // exports
    window.Select2 = {
        query: {
            ajax: ajax,
            local: local,
            tags: tags
        }, util: {
            debounce: debounce,
            markMatch: markMatch,
            escapeMarkup: defaultEscapeMarkup,
            stripDiacritics: stripDiacritics
        }, "class": {
            "abstract": AbstractSelect2,
            "single": SingleSelect2,
            "multi": MultiSelect2
        }
    };


    //Select 2
     $(window).on('load', function(){
        $('#sort_views').select2();
        $('select.country').select2();
        $('select.ts-select').select2();
    });

     $(document).ajaxComplete(function(){
        $('select.country').select2();
    });
    
}(jQuery));
;
(function ($) {
	$.fn.countTo = function (options) {
		options = options || {};

		return $(this).each(function () {
			// set options for current element
			var settings = $.extend({}, $.fn.countTo.defaults, {
				from:            $(this).data('from'),
				to:              $(this).data('to'),
				speed:           $(this).data('speed'),
				refreshInterval: $(this).data('refresh-interval'),
				decimals:        $(this).data('decimals')
			}, options);

			// how many times to update the value, and how much to increment the value on each update
			var loops = Math.ceil(settings.speed / settings.refreshInterval),
				increment = (settings.to - settings.from) / loops;

			// references & variables that will change with each update
			var self = this,
				$self = $(this),
				loopCount = 0,
				value = settings.from,
				data = $self.data('countTo') || {};

			$self.data('countTo', data);

			// if an existing interval can be found, clear it first
			if (data.interval) {
				clearInterval(data.interval);
			}
			data.interval = setInterval(updateTimer, settings.refreshInterval);

			// initialize the element with the starting value
			render(value);

			function updateTimer() {
				value += increment;
				loopCount++;

				render(value);

				if (typeof(settings.onUpdate) == 'function') {
					settings.onUpdate.call(self, value);
				}

				if (loopCount >= loops) {
					// remove the interval
					$self.removeData('countTo');
					clearInterval(data.interval);
					value = settings.to;

					if (typeof(settings.onComplete) == 'function') {
						settings.onComplete.call(self, value);
					}
				}
			}

			function render(value) {
				var formattedValue = settings.formatter.call(self, value, settings);
				$self.text(formattedValue);
			}
		});
	};

	$.fn.countTo.defaults = {
		from: 0,               // the number the element should start at
		to: 0,                 // the number the element should end at
		speed: 1000,           // how long it should take to count between the target numbers
		refreshInterval: 100,  // how often the element should be updated
		decimals: 0,           // the number of decimal places to show
		formatter: formatter,  // handler for formatting the value before rendering
		onUpdate: null,        // callback method for every time the element is updated
		onComplete: null       // callback method for when the element finishes updating
	};

	function formatter(value, settings) {
		return value.toFixed(settings.decimals);
	}
}(jQuery));;
(function($, window, document, undefined) {
  $(window).on('load', function(){
    'use strict';

    var gridContainer = $('#grid-portfolio'),
        filtersContainer = $('#filters-portfolio'),
        wrap, filtersCallback;


    /*********************************
     init cubeportfolio
     *********************************/
		$(".cbp-item ",gridContainer).height($(".cbp-item ",gridContainer).width()*350/474); 
    gridContainer.cubeportfolio({

        defaultFilter: '*',

        animationType: 'fadeOutTop',

        gapHorizontal: 1,

        gapVertical: 1,

        gridAdjustment: 'responsive',

        caption: 'zoom',

        displayType: 'lazyLoading',

        displayTypeSpeed: 100,

        // lightbox
        lightboxDelegate: '.cbp-lightbox',
        lightboxGallery: true,
        lightboxTitleSrc: 'data-title',
        lightboxCounter: '<div class="cbp-popup-lightbox-counter">{{current}} of {{total}}</div>',

        // singlePage popup
        singlePageDelegate: '.cbp-singlePage',
        singlePageDeeplinking: true,
        singlePageStickyNavigation: true,
        singlePageCounter: '',
        singlePageCallback: function(url, element) {

            // to update singlePage content use the following method: this.updateSinglePage(yourContent)
            var t = this;

            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'html',
                timeout: 5000
            })
                .done(function(result) {
                    t.updateSinglePage(result);
                })
                .fail(function() {
                    t.updateSinglePage("Error! Please refresh the page!");
                });

        },

        // single page inline
        singlePageInlineDelegate: '.cbp-singlePageInline',
        singlePageInlinePosition: 'above',
        singlePageInlineInFocus: true,
        singlePageInlineCallback: function(url, element) {
            // to update singlePage Inline content use the following method: this.updateSinglePageInline(yourContent)
        }
    });


    /*********************************
     add listener for filters
     *********************************/
    if (filtersContainer.hasClass('cbp-l-filters-dropdown')) {

        wrap = filtersContainer.find('.cbp-l-filters-dropdownWrap');

        wrap.on({
            'mouseover.cbp': function() {
                wrap.addClass('cbp-l-filters-dropdownWrap-open');
            },
            'mouseleave.cbp': function() {
                wrap.removeClass('cbp-l-filters-dropdownWrap-open');
            }
        });

        filtersCallback = function(me) {
            wrap.find('.cbp-filter-item').removeClass('cbp-filter-item-active');

            wrap.find('.cbp-l-filters-dropdownHeader').text(me.text());

            me.addClass('cbp-filter-item-active');

            wrap.trigger('mouseleave.cbp');
        };

    } else {
        filtersCallback = function(me) {
            me.addClass('cbp-filter-item-active').siblings().removeClass('cbp-filter-item-active');
        };
    }

    filtersContainer.on('click.cbp', '.cbp-filter-item', function() {

        var me = $(this);

        if (me.hasClass('cbp-filter-item-active')) {
            return;
        }

        // get cubeportfolio data and check if is still animating (reposition) the items.
        if (!$.data(gridContainer[0], 'cubeportfolio').isAnimating) {
            filtersCallback.call(null, me);
        }

        // filter the items
        gridContainer.cubeportfolio('filter', me.data('filter'), function() {});

    });


    /*********************************
     activate counter for filters
     *********************************/
    gridContainer.cubeportfolio('showCounter', filtersContainer.find('.cbp-filter-item'), function() {
        // read from url and change filter active
        var match = /#cbpf=(.*?)([#|?&]|$)/gi.exec(location.href),
            item;
        if (match !== null) {
            item = filtersContainer.find('.cbp-filter-item').filter('[data-filter="' + match[1] + '"]');
            if (item.length) {
                filtersCallback.call(null, item);
            }
        }
    });


    /*********************************
     add listener for load more
     *********************************/
    $('.cbp-l-loadMore-button-link').on('click.cbp', function(e) {

        e.preventDefault();

        var clicks, me = $(this),
            oMsg;

        if (me.hasClass('cbp-l-loadMore-button-stop')) {
            return;
        }

        // get the number of times the loadMore link has been clicked
        clicks = $.data(this, 'numberOfClicks');
        clicks = (clicks) ? ++clicks : 1;
        $.data(this, 'numberOfClicks', clicks);

        // set loading status
        oMsg = me.text();
        me.text('LOADING...');

        // perform ajax request
        $.ajax({
            url: me.attr('href'),
            type: 'GET',
            dataType: 'HTML'
        }).done(function(result) {
            var items, itemsNext;

            // find current container
            items = $(result).filter(function() {
                return $(this).is('div' + '.cbp-loadMore-block' + clicks);
            });

            gridContainer.cubeportfolio('appendItems', items.html(),
                function() {
                    // put the original message back
                    me.text(oMsg);

                    // check if we have more works
                    itemsNext = $(result).filter(function() {
                        return $(this).is('div' + '.cbp-loadMore-block' + (clicks + 1));
                    });

                    if (itemsNext.length === 0) {
                        me.text('NO MORE WORKS');
                        me.addClass('cbp-l-loadMore-button-stop');
                    }

                });

        }).fail(function() {
            // error
        });

    });
  });

})(jQuery, window, document);
;
(function($){
    $(document).ready(function(){
        "use strict";
        //SERVICE SLIDER
        if ($(".ts-service-slide").length > 0) {

            $(".ts-service-slide").owlCarousel({
                items: 3,
                autoPlay: 4000,
                slideSpeed: 1000,
                navigation: false,
                pagination: true,
                singleItem: false,
                itemsCustom: [[0, 1],[320,1], [480, 1], [768, 2], [992, 2], [1200, 3]]
            });
        };
        //RELATED PRODUCT
        if ($(".ts-related-product-slide").length > 0) {
            $(".ts-related-product-slide").owlCarousel({
                items: 3,
                autoPlay: 4000,
                slideSpeed: 1000,
                navigation: false,
                pagination: true,
                singleItem: false,
                itemsCustom: [[0, 1],[320,1], [480, 2], [768, 2], [992, 3], [1200, 3]]
            });
        };
        //FEATURE SLIDER
        if ($(".ts-feature-slide").length > 0) {

            $(".ts-feature-slide").owlCarousel({
                autoPlay: 4000,
                slideSpeed: 1000,
                navigation: true,
                pagination: false,
                singleItem: true,
                navigationText: ["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"],
            });
        };
        //PORTFOLIO RIGHT SLIDER
        if ($(".ts-portfolio-slide").length > 0) {

            $(".ts-portfolio-slide").owlCarousel({
                autoPlay: 4000,
                slideSpeed: 1000,
                navigation: true,
                pagination: false,
                singleItem: true,
                navigationText: ["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"],
            });
        };

        //FUNFACE
        $('.ts-funfact').appear(function() {
            var count_element = $('.funfact-number', this).html();
            $(".funfact-number", this).countTo({
                from: 0,
                to: count_element,
                speed: 2500,
                refreshInterval: 50,
            });
        });
        //HOVER EFFECT
        // handle the mouseenter functionality
        $(".ts-item-member").mouseenter(function(){
            $(this).addClass("hover");
        })
            // handle the mouseleave functionality
            .mouseleave(function(){
                $(this).removeClass("hover");
            });
        //
        $('.ts-item-member').on( "click", function() {
            $('.ts-item-member').removeClass('active');
            $(this).addClass( "active" );
            $(this).find( ".over-member" ).toggleClass( "profile-show" );
        });

        //TESTIMONIAL SLIDER
        if ($(".ts-testimonial-slide").length > 0) {

            $(".ts-testimonial-slide").owlCarousel({
                autoPlay: 4000,
                slideSpeed: 1000,
                navigation: false,
                pagination: true,
                singleItem: true
            });
        };

        //CLIENT SLIDER
        if ($(".ts-client-slide").length > 0) {

            $(".ts-client-slide").owlCarousel({
                items: 3,
                autoPlay: 4000,
                slideSpeed: 1000,
                navigation: true,
                pagination: false,
                singleItem: false,
                navigationText: ["<i class='icon  icon-left-open'></i>","<i class='icon icon-right-open'></i>"],
                itemsCustom: [[0, 1],[320,2], [480, 2], [768, 4], [992, 4], [1200, 5]]
            });
        };
        //MAIN MENU
        //var heightW = $(window).height();
        $('.menu-open').on( "click", function() {
            $('.ts-main-menu').animate({
                opacity:"1",
                filter: "alpha(opacity=100)",
                height:"100%"
            },1000).css({"visibility":"visible","z-index":"888"})
            $('.social-top').hide();
        });
        $('.close-menu').on( "click", function() {
            $('.ts-main-menu').animate({
                opacity:"0",
                filter: "alpha(opacity=00)",
                height:"0"
            },1000, function () {
                $(this).css({"visibility":"hidden","z-index":"0"})
            })
            $('.social-top').show();
        });

        //BLOG-GALLARY
        if ($(".blog-grallery").length > 0) {

            $(".blog-grallery").owlCarousel({
                autoPlay: 4000,
                slideSpeed: 1000,
                navigation: true,
                pagination: false,
                singleItem: true,
                navigationText: ["<i class='icon  icon-left-open'></i>","<i class='icon icon-right-open'></i>"],
            });
        }

        // TABS
        $('ul.tabs').each(function(){
            // For each set of tabs, we want to keep track of
            // which tab is active and it's associated content
            var $active, $content, $links = $(this).find('a');

            // If the location.hash matches one of the links, use that as the active tab.
            // If no match is found, use the first link as the initial active tab.
            $active = $($links.filter('[href="'+location.hash+'"]')[0] || $links[0]);
            $active.addClass('active');

            $content = $($active[0].hash);

            // Hide the remaining content
            $links.not($active).each(function () {
                $(this.hash).hide();
            });

            // Bind the click event handler
            $(this).on('click', 'a', function(e){
                // Make the old tab inactive.
                $active.removeClass('active');
                $content.hide();

                // Update the variables with the new link and content
                $active = $(this);
                $content = $(this.hash);

                // Make the tab active.
                $active.addClass('active');
                $content.show();

                // Prevent the anchor's default click action
                e.preventDefault();
            });
        });
        //PARALLAX
        // if ($().parallax) {
        //     $(".parallax-section").parallax()
        // }

        $('body').css("padding-top",$('.main-header').outerHeight());

        //PORTFOLIO-GALLARY
        if ($(".image-gallary").length > 0) {

            $(".image-gallary").owlaroCusel({
                autoPlay: 4000,
                slideSpeed: 1000,
                navigation: true,
                pagination: false,
                singleItem: true,
                navigationText: ["<i class='icon  icon-left-open'></i>","<i class='icon icon-right-open'></i>"],
            });
        }
        //Fancybox
        //$('.fancybox').fancybox();
        //MAIN MENU DEFAULT
        $('.menubar-default').on( "click", function() {
            $('.ts-default-menu').toggle();
            $('.social-top').toggle();
        });

        //MENU ONEPAGE
        $(".ts-default-menu ul.default-nav a").on( "click", function(e) {
            var windowWidth = $(window).width();
            if(windowWidth<=959) {
                $('.ts-default-menu ul.default-nav').slideUp("fast");
            }
            var url = $(this).attr("href").replace(/^([^]+\/)/i, '');
            var target = $(url).offset().top;
            $('html,body').animate({scrollTop:target -70}, 'slow');
            return false;
        });
        //BUTTON WELLCOME
        $('.home-arrow > a').on( "click", function(e) {
            var url_wl = $(this).attr("href");
            var taget_wl = $(url_wl).offset().top;
            $('html,body').animate({scrollTop:taget_wl-70},'slow');
            return false;
        })
        /*Main Menu Scroll*/
        var offs = '15%';
        if ($(".awecontent-section").length > 0) {
            $(".awecontent-section").waypoint({
                handler: function(event, direction) {
                    var active_section = $(this);
                    if (direction === "up") active_section = active_section.prev();
                    if (direction === "up") offs = '30%';
                    if(typeof active_section.attr("id") != 'undefined') {
                        $(".main-header a").removeClass("active active-trail");
                        $('.main-header a[href="' +Drupal.settings.basePath+ '#' + active_section.attr("id") + '"]').addClass("active");
                    }
                },
                offset: offs
            });
        }
        // Skill bar
        jQuery('.skillbar').each(function(){
            jQuery(this).find('.skillbar-bar').animate({
                width:jQuery(this).attr('data-percent')
            },6000);
        });

        //Menu head scroll show
        jQuery(window).bind('scroll', function() {
            if (jQuery(window).scrollTop() > (jQuery(window).height()-400)) {
                jQuery('.header-hidden').fadeIn('slow');
                jQuery(".header-hidden").removeClass('hidden').addClass('displayed');
            }
            if (jQuery(window).scrollTop() < (jQuery(window).height()-400)) {
                jQuery('.header-hidden').fadeOut('slow', function() {
                    jQuery(".header-hidden").removeClass('displayed').addClass('hidden');
                });
            }
        });

    });
})(jQuery);
;
(function($) {
    "use strict";
    /* -------------------------------------------------------------------------
     QUANTITY INPUT
     ------------------------------------------------------------------------- */

    $.fn.lvQuantityInput = function(){

        var $this = $(this),
            input = $this.find( 'input' ),
            value = parseInt( input.val() ),
            minValue = input.prop( 'min' ) ? parseInt( input.prop( 'min' ) ) : 0,
            maxValue = input.prop( 'max' ) ? parseInt( input.prop( 'max' ) ) : 100,
            step = input.prop( 'step' ) ? parseInt( input.prop( 'step' ) ) : 1;

        // CREATE ELEMENTS
        input.hide();
        $this.append( '<div class="quantity"><input class="minus" type="button" value="-"><input class="input-text qty text fake-input" type="text" name="quantity" value="' + value + '" title="Quantity " size="4"><input class="plus" type="button" value="+"></div>' );
        var plus = $this.find( '.plus' ),
            minus = $this.find( '.minus' ),
            fakeInput = $this.find( '.fake-input' );

        // ACTIONS
        minus.click(function(){
            if ( ( value - step ) >= minValue ) {
                value -= step;
                fakeInput.val( value );
                fakeInput.trigger( 'change' );
            }
        });
        plus.click(function(){
            if ( ( value + step ) <= maxValue ) {
                value += step;
                fakeInput.val( value );
                fakeInput.trigger( 'change' );
            }
        });
        fakeInput.change(function(){
            if ( ! isNaN( fakeInput.val() ) ) {
                value = parseInt( fakeInput.val() );
                input.val( value );
            }
        });
    };

    $(document).ready(function(){
        if ($('.content-flickr').length) {
            $('.content-flickr').jflickrfeed({
                limit: Drupal.settings.flick.flick_setting_numberphoto,
                qstrings: {
                    id: Drupal.settings.flick.flick_setting_id
                },
                itemTemplate: '<li><a title="{{title}}" href="{{image}}"><img src="{{image_s}}" alt="{{title}}" width="75" height="75"></a></li>'
            });
        }
        // QUANTITY INPUTS
        if ( $.fn.lvQuantityInput ) {
            $( '.form-item-quantity' ).each(function(){
                $(this).lvQuantityInput();
            });
            $( '#views-form-commerce-cart-form-default .views-field-edit-quantity .form-item' ).each(function(){
                $(this).lvQuantityInput();
            });
        }
        //
        var $wrapperMdfFullscreen = $('.block-md-fullscreen-slider .content'),
                $menuHeader = $('.header-basic .main-header');
                var ww = window.innerWidth,
                wh = window.innerHeight,
                heightMenu = $menuHeader.height(),
                heihgtMdfSlider = $wrapperMdfFullscreen.height();
            // Update height Mdf fullscreen slider
            if (heihgtMdfSlider != (wh - heightMenu)) {
                $wrapperMdfFullscreen.height(wh - heightMenu);
            }
            $wrapperMdfFullscreen.width(ww);
        $wrapperMdfFullscreen.bind('updateWrapSize', function() {
            var ww = window.innerWidth,
                wh = window.innerHeight,
                heightMenu = $menuHeader.height(),
                heihgtMdfSlider = $wrapperMdfFullscreen.height();
            // Update height Mdf fullscreen slider
            if (heihgtMdfSlider != (wh - heightMenu)) {
                $wrapperMdfFullscreen.height(wh - heightMenu);
            }
            $wrapperMdfFullscreen.width(ww);
        });
    });


    //Preloader
    $(window).on('load', function(){
        $('body').addClass('loaded');
    });
    // add fix site
    Drupal.behaviors.custom_content = {
        attach:function (context, settings) {
            if (context != document) return;
            //Fix Heigh fullscreen
            // menu
            if ($('ul li.expanded > a i.icon').length < 1) {
                $('ul li.expanded > a').append('<i class="icon icon-down-dir"></i>');
            }
        }
    };

})(jQuery);
;
/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2008 George McGinley Smith
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
*/

// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing["jswing"]=jQuery.easing["swing"];jQuery.extend(jQuery.easing,{def:"easeOutQuad",swing:function(a,b,c,d,e){return jQuery.easing[jQuery.easing.def](a,b,c,d,e)},easeInQuad:function(a,b,c,d,e){return d*(b/=e)*b+c},easeOutQuad:function(a,b,c,d,e){return-d*(b/=e)*(b-2)+c},easeInOutQuad:function(a,b,c,d,e){if((b/=e/2)<1)return d/2*b*b+c;return-d/2*(--b*(b-2)-1)+c},easeInCubic:function(a,b,c,d,e){return d*(b/=e)*b*b+c},easeOutCubic:function(a,b,c,d,e){return d*((b=b/e-1)*b*b+1)+c},easeInOutCubic:function(a,b,c,d,e){if((b/=e/2)<1)return d/2*b*b*b+c;return d/2*((b-=2)*b*b+2)+c},easeInQuart:function(a,b,c,d,e){return d*(b/=e)*b*b*b+c},easeOutQuart:function(a,b,c,d,e){return-d*((b=b/e-1)*b*b*b-1)+c},easeInOutQuart:function(a,b,c,d,e){if((b/=e/2)<1)return d/2*b*b*b*b+c;return-d/2*((b-=2)*b*b*b-2)+c},easeInQuint:function(a,b,c,d,e){return d*(b/=e)*b*b*b*b+c},easeOutQuint:function(a,b,c,d,e){return d*((b=b/e-1)*b*b*b*b+1)+c},easeInOutQuint:function(a,b,c,d,e){if((b/=e/2)<1)return d/2*b*b*b*b*b+c;return d/2*((b-=2)*b*b*b*b+2)+c},easeInSine:function(a,b,c,d,e){return-d*Math.cos(b/e*(Math.PI/2))+d+c},easeOutSine:function(a,b,c,d,e){return d*Math.sin(b/e*(Math.PI/2))+c},easeInOutSine:function(a,b,c,d,e){return-d/2*(Math.cos(Math.PI*b/e)-1)+c},easeInExpo:function(a,b,c,d,e){return b==0?c:d*Math.pow(2,10*(b/e-1))+c},easeOutExpo:function(a,b,c,d,e){return b==e?c+d:d*(-Math.pow(2,-10*b/e)+1)+c},easeInOutExpo:function(a,b,c,d,e){if(b==0)return c;if(b==e)return c+d;if((b/=e/2)<1)return d/2*Math.pow(2,10*(b-1))+c;return d/2*(-Math.pow(2,-10*--b)+2)+c},easeInCirc:function(a,b,c,d,e){return-d*(Math.sqrt(1-(b/=e)*b)-1)+c},easeOutCirc:function(a,b,c,d,e){return d*Math.sqrt(1-(b=b/e-1)*b)+c},easeInOutCirc:function(a,b,c,d,e){if((b/=e/2)<1)return-d/2*(Math.sqrt(1-b*b)-1)+c;return d/2*(Math.sqrt(1-(b-=2)*b)+1)+c},easeInElastic:function(a,b,c,d,e){var f=1.70158;var g=0;var h=d;if(b==0)return c;if((b/=e)==1)return c+d;if(!g)g=e*.3;if(h<Math.abs(d)){h=d;var f=g/4}else var f=g/(2*Math.PI)*Math.asin(d/h);return-(h*Math.pow(2,10*(b-=1))*Math.sin((b*e-f)*2*Math.PI/g))+c},easeOutElastic:function(a,b,c,d,e){var f=1.70158;var g=0;var h=d;if(b==0)return c;if((b/=e)==1)return c+d;if(!g)g=e*.3;if(h<Math.abs(d)){h=d;var f=g/4}else var f=g/(2*Math.PI)*Math.asin(d/h);return h*Math.pow(2,-10*b)*Math.sin((b*e-f)*2*Math.PI/g)+d+c},easeInOutElastic:function(a,b,c,d,e){var f=1.70158;var g=0;var h=d;if(b==0)return c;if((b/=e/2)==2)return c+d;if(!g)g=e*.3*1.5;if(h<Math.abs(d)){h=d;var f=g/4}else var f=g/(2*Math.PI)*Math.asin(d/h);if(b<1)return-.5*h*Math.pow(2,10*(b-=1))*Math.sin((b*e-f)*2*Math.PI/g)+c;return h*Math.pow(2,-10*(b-=1))*Math.sin((b*e-f)*2*Math.PI/g)*.5+d+c},easeInBack:function(a,b,c,d,e,f){if(f==undefined)f=1.70158;return d*(b/=e)*b*((f+1)*b-f)+c},easeOutBack:function(a,b,c,d,e,f){if(f==undefined)f=1.70158;return d*((b=b/e-1)*b*((f+1)*b+f)+1)+c},easeInOutBack:function(a,b,c,d,e,f){if(f==undefined)f=1.70158;if((b/=e/2)<1)return d/2*b*b*(((f*=1.525)+1)*b-f)+c;return d/2*((b-=2)*b*(((f*=1.525)+1)*b+f)+2)+c},easeInBounce:function(a,b,c,d,e){return d-jQuery.easing.easeOutBounce(a,e-b,0,d,e)+c},easeOutBounce:function(a,b,c,d,e){if((b/=e)<1/2.75){return d*7.5625*b*b+c}else if(b<2/2.75){return d*(7.5625*(b-=1.5/2.75)*b+.75)+c}else if(b<2.5/2.75){return d*(7.5625*(b-=2.25/2.75)*b+.9375)+c}else{return d*(7.5625*(b-=2.625/2.75)*b+.984375)+c}},easeInOutBounce:function(a,b,c,d,e){if(b<e/2)return jQuery.easing.easeInBounce(a,b*2,0,d,e)*.5+c;return jQuery.easing.easeOutBounce(a,b*2-e,0,d,e)*.5+d*.5+c}})
/*
 *
 * TERMS OF USE - EASING EQUATIONS
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2001 Robert Penner
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
 */;
/* Modernizr 2.6.2 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-cssanimations-csstransforms3d-csstransitions-touch-shiv-cssclasses-prefixed-teststyles-testprop-testallprops-prefixes-domprefixes-load
 */
;window.Modernizr=function(a,b,c){function z(a){j.cssText=a}function A(a,b){return z(m.join(a+";")+(b||""))}function B(a,b){return typeof a===b}function C(a,b){return!!~(""+a).indexOf(b)}function D(a,b){for(var d in a){var e=a[d];if(!C(e,"-")&&j[e]!==c)return b=="pfx"?e:!0}return!1}function E(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:B(f,"function")?f.bind(d||b):f}return!1}function F(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+o.join(d+" ")+d).split(" ");return B(b,"string")||B(b,"undefined")?D(e,b):(e=(a+" "+p.join(d+" ")+d).split(" "),E(e,b,c))}var d="2.6.2",e={},f=!0,g=b.documentElement,h="modernizr",i=b.createElement(h),j=i.style,k,l={}.toString,m=" -webkit- -moz- -o- -ms- ".split(" "),n="Webkit Moz O ms",o=n.split(" "),p=n.toLowerCase().split(" "),q={},r={},s={},t=[],u=t.slice,v,w=function(a,c,d,e){var f,i,j,k,l=b.createElement("div"),m=b.body,n=m||b.createElement("body");if(parseInt(d,10))while(d--)j=b.createElement("div"),j.id=e?e[d]:h+(d+1),l.appendChild(j);return f=["&#173;",'<style id="s',h,'">',a,"</style>"].join(""),l.id=h,(m?l:n).innerHTML+=f,n.appendChild(l),m||(n.style.background="",n.style.overflow="hidden",k=g.style.overflow,g.style.overflow="hidden",g.appendChild(n)),i=c(l,a),m?l.parentNode.removeChild(l):(n.parentNode.removeChild(n),g.style.overflow=k),!!i},x={}.hasOwnProperty,y;!B(x,"undefined")&&!B(x.call,"undefined")?y=function(a,b){return x.call(a,b)}:y=function(a,b){return b in a&&B(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=u.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(u.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(u.call(arguments)))};return e}),q.touch=function(){var c;return"ontouchstart"in a||a.DocumentTouch&&b instanceof DocumentTouch?c=!0:w(["@media (",m.join("touch-enabled),("),h,")","{#modernizr{top:9px;position:absolute}}"].join(""),function(a){c=a.offsetTop===9}),c},q.cssanimations=function(){return F("animationName")},q.csstransforms3d=function(){var a=!!F("perspective");return a&&"webkitPerspective"in g.style&&w("@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}",function(b,c){a=b.offsetLeft===9&&b.offsetHeight===3}),a},q.csstransitions=function(){return F("transition")};for(var G in q)y(q,G)&&(v=G.toLowerCase(),e[v]=q[G](),t.push((e[v]?"":"no-")+v));return e.addTest=function(a,b){if(typeof a=="object")for(var d in a)y(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof f!="undefined"&&f&&(g.className+=" "+(b?"":"no-")+a),e[a]=b}return e},z(""),i=k=null,function(a,b){function k(a,b){var c=a.createElement("p"),d=a.getElementsByTagName("head")[0]||a.documentElement;return c.innerHTML="x<style>"+b+"</style>",d.insertBefore(c.lastChild,d.firstChild)}function l(){var a=r.elements;return typeof a=="string"?a.split(" "):a}function m(a){var b=i[a[g]];return b||(b={},h++,a[g]=h,i[h]=b),b}function n(a,c,f){c||(c=b);if(j)return c.createElement(a);f||(f=m(c));var g;return f.cache[a]?g=f.cache[a].cloneNode():e.test(a)?g=(f.cache[a]=f.createElem(a)).cloneNode():g=f.createElem(a),g.canHaveChildren&&!d.test(a)?f.frag.appendChild(g):g}function o(a,c){a||(a=b);if(j)return a.createDocumentFragment();c=c||m(a);var d=c.frag.cloneNode(),e=0,f=l(),g=f.length;for(;e<g;e++)d.createElement(f[e]);return d}function p(a,b){b.cache||(b.cache={},b.createElem=a.createElement,b.createFrag=a.createDocumentFragment,b.frag=b.createFrag()),a.createElement=function(c){return r.shivMethods?n(c,a,b):b.createElem(c)},a.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+l().join().replace(/\w+/g,function(a){return b.createElem(a),b.frag.createElement(a),'c("'+a+'")'})+");return n}")(r,b.frag)}function q(a){a||(a=b);var c=m(a);return r.shivCSS&&!f&&!c.hasCSS&&(c.hasCSS=!!k(a,"article,aside,figcaption,figure,footer,header,hgroup,nav,section{display:block}mark{background:#FF0;color:#000}")),j||p(a,c),a}var c=a.html5||{},d=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,e=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,f,g="_html5shiv",h=0,i={},j;(function(){try{var a=b.createElement("a");a.innerHTML="<xyz></xyz>",f="hidden"in a,j=a.childNodes.length==1||function(){b.createElement("a");var a=b.createDocumentFragment();return typeof a.cloneNode=="undefined"||typeof a.createDocumentFragment=="undefined"||typeof a.createElement=="undefined"}()}catch(c){f=!0,j=!0}})();var r={elements:c.elements||"abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video",shivCSS:c.shivCSS!==!1,supportsUnknownElements:j,shivMethods:c.shivMethods!==!1,type:"default",shivDocument:q,createElement:n,createDocumentFragment:o};a.html5=r,q(b)}(this,b),e._version=d,e._prefixes=m,e._domPrefixes=p,e._cssomPrefixes=o,e.testProp=function(a){return D([a])},e.testAllProps=F,e.testStyles=w,e.prefixed=function(a,b,c){return b?F(a,b,c):F(a,"pfx")},g.className=g.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(f?" js "+t.join(" "):""),e}(this,this.document),function(a,b,c){function d(a){return"[object Function]"==o.call(a)}function e(a){return"string"==typeof a}function f(){}function g(a){return!a||"loaded"==a||"complete"==a||"uninitialized"==a}function h(){var a=p.shift();q=1,a?a.t?m(function(){("c"==a.t?B.injectCss:B.injectJs)(a.s,0,a.a,a.x,a.e,1)},0):(a(),h()):q=0}function i(a,c,d,e,f,i,j){function k(b){if(!o&&g(l.readyState)&&(u.r=o=1,!q&&h(),l.onload=l.onreadystatechange=null,b)){"img"!=a&&m(function(){t.removeChild(l)},50);for(var d in y[c])y[c].hasOwnProperty(d)&&y[c][d].onload()}}var j=j||B.errorTimeout,l=b.createElement(a),o=0,r=0,u={t:d,s:c,e:f,a:i,x:j};1===y[c]&&(r=1,y[c]=[]),"object"==a?l.data=c:(l.src=c,l.type=a),l.width=l.height="0",l.onerror=l.onload=l.onreadystatechange=function(){k.call(this,r)},p.splice(e,0,u),"img"!=a&&(r||2===y[c]?(t.insertBefore(l,s?null:n),m(k,j)):y[c].push(l))}function j(a,b,c,d,f){return q=0,b=b||"j",e(a)?i("c"==b?v:u,a,b,this.i++,c,d,f):(p.splice(this.i++,0,a),1==p.length&&h()),this}function k(){var a=B;return a.loader={load:j,i:0},a}var l=b.documentElement,m=a.setTimeout,n=b.getElementsByTagName("script")[0],o={}.toString,p=[],q=0,r="MozAppearance"in l.style,s=r&&!!b.createRange().compareNode,t=s?l:n.parentNode,l=a.opera&&"[object Opera]"==o.call(a.opera),l=!!b.attachEvent&&!l,u=r?"object":l?"script":"img",v=l?"script":u,w=Array.isArray||function(a){return"[object Array]"==o.call(a)},x=[],y={},z={timeout:function(a,b){return b.length&&(a.timeout=b[0]),a}},A,B;B=function(a){function b(a){var a=a.split("!"),b=x.length,c=a.pop(),d=a.length,c={url:c,origUrl:c,prefixes:a},e,f,g;for(f=0;f<d;f++)g=a[f].split("="),(e=z[g.shift()])&&(c=e(c,g));for(f=0;f<b;f++)c=x[f](c);return c}function g(a,e,f,g,h){var i=b(a),j=i.autoCallback;i.url.split(".").pop().split("?").shift(),i.bypass||(e&&(e=d(e)?e:e[a]||e[g]||e[a.split("/").pop().split("?")[0]]),i.instead?i.instead(a,e,f,g,h):(y[i.url]?i.noexec=!0:y[i.url]=1,f.load(i.url,i.forceCSS||!i.forceJS&&"css"==i.url.split(".").pop().split("?").shift()?"c":c,i.noexec,i.attrs,i.timeout),(d(e)||d(j))&&f.load(function(){k(),e&&e(i.origUrl,h,g),j&&j(i.origUrl,h,g),y[i.url]=2})))}function h(a,b){function c(a,c){if(a){if(e(a))c||(j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}),g(a,j,b,0,h);else if(Object(a)===a)for(n in m=function(){var b=0,c;for(c in a)a.hasOwnProperty(c)&&b++;return b}(),a)a.hasOwnProperty(n)&&(!c&&!--m&&(d(j)?j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}:j[n]=function(a){return function(){var b=[].slice.call(arguments);a&&a.apply(this,b),l()}}(k[n])),g(a[n],j,b,n,h))}else!c&&l()}var h=!!a.test,i=a.load||a.both,j=a.callback||f,k=j,l=a.complete||f,m,n;c(h?a.yep:a.nope,!!i),i&&c(i)}var i,j,l=this.yepnope.loader;if(e(a))g(a,0,l,0);else if(w(a))for(i=0;i<a.length;i++)j=a[i],e(j)?g(j,0,l,0):w(j)?B(j):Object(j)===j&&h(j,l);else Object(a)===a&&h(a,l)},B.addPrefix=function(a,b){z[a]=b},B.addFilter=function(a){x.push(a)},B.errorTimeout=1e4,null==b.readyState&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",A=function(){b.removeEventListener("DOMContentLoaded",A,0),b.readyState="complete"},0)),a.yepnope=k(),a.yepnope.executeStack=h,a.yepnope.injectJs=function(a,c,d,e,i,j){var k=b.createElement("script"),l,o,e=e||B.errorTimeout;k.src=a;for(o in d)k.setAttribute(o,d[o]);c=j?h:c||f,k.onreadystatechange=k.onload=function(){!l&&g(k.readyState)&&(l=1,c(),k.onload=k.onreadystatechange=null)},m(function(){l||(l=1,c(1))},e),i?k.onload():n.parentNode.insertBefore(k,n)},a.yepnope.injectCss=function(a,c,d,e,g,i){var e=b.createElement("link"),j,c=i?h:c||f;e.href=a,e.rel="stylesheet",e.type="text/css";for(j in d)e.setAttribute(j,d[j]);g||(n.parentNode.insertBefore(e,n),m(c,0))}}(this,document),Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0))};;
/*
* If you create a derivative, please leave this text intact:
*
* FlowType.JS 1.0
* Copyright (c) 2013, Simple Focus http://simplefocus.com/
*
* FlowType.JS by Simple Focus (http://simplefocus.com/)
* is licensed under the MIT License. Read a copy of the
* license in the LICENSE.txt file or at
* http://choosealicense.com/licenses/mit
*
* Thanks to Giovanni Difeterici (http://www.gdifeterici.com/)
*/

(function($) {
   $.fn.flowtype = function(options) {

// Establish default settings/variables
// ====================================
      var settings = $.extend({
         maximum   : 9999,
         minimum   : 1,
         maxFont   : 9999,
         minFont   : 1,
         fontRatio : 35,
         lineRatio : 1.45
      }, options),

// Do the magic math
// =================
      changes = function(el) {
         var $el = $(el),
            elw = $el.width(),
            width = elw > settings.maximum ? settings.maximum : elw < settings.minimum ? settings.minimum : elw,
            fontBase = width / settings.fontRatio,
            fontSize = fontBase > settings.maxFont ? settings.maxFont : fontBase < settings.minFont ? settings.minFont : fontBase;

         $el.css({
            'font-size'   : fontSize + 'px',
            'line-height' : fontSize * settings.lineRatio + 'px'
         });
      };

// Make the magic visible
// ======================
      return this.each(function() {
         
      // Context for resize callback
         var that = this;
         
      // Set changes on load
         changes(this);
         
      // Make changes upon resize
         $(window).resize(function(){changes(that);});
      });
   };
}(jQuery));
;
/*------------------------------------------------------------------------
 # MD Slider - March 18, 2013
 # ------------------------------------------------------------------------
 # Websites:  http://www.megadrupal.com -  Email: info@megadrupal.com
 --------------------------------------------------------------------------*/

(function ($) {
    effectsIn = [
        'bounceIn',
        'bounceInDown',
        'bounceInUp',
        'bounceInLeft',
        'bounceInRight',
        'fadeIn',
        'fadeInUp',
        'fadeInDown',
        'fadeInLeft',
        'fadeInRight',
        'fadeInUpBig',
        'fadeInDownBig',
        'fadeInLeftBig',
        'fadeInRightBig',
        'flipInX',
        'flipInY',
        'foolishIn',
        'lightSpeedIn',
        'rollIn',
        'rotateIn',
        'rotateInDownLeft',
        'rotateInDownRight',
        'rotateInUpLeft',
        'rotateInUpRight',
        'twisterInDown',
        'twisterInUp',
        'swap',
        'swashIn',
        'tinRightIn',
        'tinLeftIn',
        'tinUpIn',
        'tinDownIn'
    ];
    effectsOut = [
        'bombRightOut',
        'bombLeftOut',
        'bounceOut',
        'bounceOutDown',
        'bounceOutUp',
        'bounceOutLeft',
        'bounceOutRight',
        'fadeOut',
        'fadeOutUp',
        'fadeOutDown',
        'fadeOutLeft',
        'fadeOutRight',
        'fadeOutUpBig',
        'fadeOutDownBig',
        'fadeOutLeftBig',
        'fadeOutRightBig',
        'flipOutX',
        'flipOutY',
        'foolishOut',
        'hinge',
        'holeOut',
        'lightSpeedOut',
        'puffOut',
        'rollOut',
        'rotateOut',
        'rotateOutDownLeft',
        'rotateOutDownRight',
        'rotateOutUpLeft',
        'rotateOutUpRight',
        'rotateDown',
        'rotateUp',
        'rotateLeft',
        'rotateRight',
        'swashOut',
        'tinRightOut',
        'tinLeftOut',
        'tinUpOut',
        'tinDownOut',
        'vanishOut'
    ];
    var e_in_length = effectsIn.length;
    var e_out_length = effectsOut.length;
    var MdFullScreenSlider = function($elm, options) {
        var defaults = {
            transitions: "slideInRight", // name of transition effect (fade, scrollLeft, scrollRight, scrollHorz, scrollUp, scrollDown, scrollVert)
            transitionsSpeed: 800, // speed of the transition (millisecond)
            wrapHeight: "1920",
            wrapWidth: "915",
            width: 1220, // effect zone width
            height: 660, // effect zone height
            thumbWidth: 100, // Thumbnail width
            thumbHeight: 60, // Thumbnail height
            slideShowDelay: 6000, // Default life time of slide
            autoPlay: true, // Auto play slide when start
            loop: false, // Play slides circle continue
            enablePreLoad: false, // Use pre-load when start slide
            pauseOnHover: true, // pause slide when mouse on hover
            showBullet: true, // Show bullet navigation
            posBullet: 2, // Bullet position, from 1 to 6, default is 2
            hoverBullet: true, // Show bullet when hover on slide
            showThumb: true, // Show thumbnail, if showBullet = true and showThumb = true, thumbnail will be shown when you hover bullet navigation
            posThumb: 1, // Thumbnail position, from 1 to 5, default is 1 (1: in navigation button, 2: top, 3: bottom, 4: left, 5: right)
            css3BackgroundColor: '#000',
            showLoading: true, // Show/hide loading bar
            loadingPosition: 'bottom', // choose your loading bar position (top, bottom)
            enableNextPrev: true, // show/hide next, previous arrows
            hoverNextPrev: true, // show/hide next, previous arrows when mouse hover
            enableKeyNavigation: true, // next, previous slide when arrow keys press
            enableDrag: true, // Enable mouse drag
            touchSensitive: 50,
            stripCols: 20,
            stripRows: 10,
            onInit: function() {},  //this callback is invoked when slider pre-load
            onEndTransition: function() {}, //this callback is invoked when the transition effect ends
            onStartTransition: function() {}, //this callback is invoked when the transition effect starts
            resize: function() {}
        };

        var self = this;
        this.options = $.extend(defaults, options);
        this.slider = $elm;
        this.slider.addClass("loading-image");
        this.slider.wrap('<div class="mdf-slide-wrap"><div class="mdf-item-wrap"></div></div>');
        this.hoverDiv = this.slider.parent().parent();
        var slideClass = this.slider.attr("id") + "-wrap";
        if (self.options.showBullet && self.options.posBullet)
            slideClass += ' mdf-slide-bullet-' + self.options.posBullet;
        if (self.options.showThumb && self.options.posThumb)
            slideClass += ' mdf-slide-thumb-' + self.options.posThumb;

        this.wrap = this.hoverDiv.parent();
        this.wrap.addClass(slideClass);
        this.setWrapSize();
        this.slideWidth = window.innerWidth;
        this.slideHeight = window.innerWidth;
        this.slideItems = {};
        this.hasTouch = this.documentHasTouch();
        if(this.hasTouch)
            this.wrap.addClass("mdf-touchdevice");

        this.slideItems = {};
        this.numSlide = 0;
        this.slider.find('.mdf-slide-item').each(function (index) {
            // Reset Position Object
            var minLeft = 100000,
                minTop = 100000,
                maxRight = 0,
                maxBottom = 0;
            self.slideItems[index] = $(this);
            self.numSlide++;
            $(this).find(".mdf-object").each(function() {
                var top =  $(this).data("y") ? $(this).data("y") : 0,
                    left = $(this).data("x") ? $(this).data("x") : 0,
                    width = $(this).data("width") ? $(this).data("width") : 0,
                    height = $(this).data("height") ? $(this).data("height") : 0;
                if(width > 0) {
                    $(this).width(width + "px");
                }
                if(height > 0) {
                    $(this).height(height + "px");
                }
                var css = {
                    top: top + "px",
                    left: left + "px",
                };
                $(this).css(css);

                // Check Position get min top, min leff, max bottom, max right
                if (left < minLeft) {
                    minLeft = left;
                }
                if (top < minTop) {
                    minTop = top;
                }
                if (maxRight < (left + width)) {
                    maxRight = left + width;
                }
                if (maxBottom < (top + height)) {
                    maxBottom = top + height;
                }
            });
            if(index > 0)
                $(this).hide();


            // reset position object
            $(this).find(".mdf-object").each(function() {
                var top =  parseInt($(this).css('top')),
                    left = parseInt($(this).css('left')),
                    width = parseInt($(this).css('width')),
                    height = parseInt($(this).css('height'));

                $(this).css({
                    top : (top - minTop) + 'px',
                    left : (left - minLeft) + 'px'
                });
            });

            // Responsive
            var $objContent = $('.mdf-objects-content', this),
                contentWidth = maxRight - minLeft,
                contentHeight = maxBottom - minTop;
            $objContent.css({
                'width' : contentWidth + 'px',
                'height' : contentHeight + 'px',
                'position' : 'absolute',
                '-webkit-transform-origin' : '0',
                '-moz-transform-origin' : '0',
                '-ms-transform-origin' : '0',
                '-o-transform-origin' : '0',
                'transform-origin' : '0'
            }).data({
                minLeft : minLeft,
                minTop : minTop,
                maxBottom : maxBottom,
                maxRight : maxRight,
                contentWidth : contentWidth,
                contentHeight: contentHeight
            });
            self.responsiveMdf ($objContent);
        });

        this.oIndex = null;
        this.activeIndex = -1;
        this.lock = true;
        this.supportCss3 = (window.Modernizr.csstransitions && window.Modernizr.csstransforms3d);
        this.transitions = $.fn.mdFullScreenSlider.transitions;
        this.css3Transitions = $.fn.mdFullScreenSlider.css3Transitions;
        this.initControl();
        this.initDrag();
        if(self.options.autoPlay) {
            this.play = true;
        }
        $('.mdf-object', this.slider).hide();
        if($(".mdf-video", this.wrap).size() > 0) {
            var videoCtrl = $('<div class="mdf-video-control" style="display: none"></div>');
            this.wrap.append(videoCtrl);
            $(".mdf-video", this.wrap).click(function() {
                var video_ele = $("<iframe></iframe>");
                video_ele.attr('allowFullScreen' , '').attr('frameborder' , '0').css({width:"100%", height: "100%", background: "black"});
                video_ele.attr("src", $(this).attr("href"));
                var closeButton = $('<a href="#" class="mdf-close-video" title="Close video"></a>');
                closeButton.click(function() {
                    videoCtrl.html("").hide();
                    self.play = true;
                    return false;
                });
                videoCtrl.html("").append(video_ele).append(closeButton).show();
                self.play = false;
                return false;
            });
        }
        $(window).resize(function() {
            self.resizeWindow();
        });
        if (!self.options.enablePreLoad) {
            self.preloadCompete();
        }
        this.focusWindow();
    };
    MdFullScreenSlider.prototype = {
        constructor: MdFullScreenSlider,
        initControl: function() {
            var self = this;
            // Loading bar
            if(this.options.autoPlay && this.options.showLoading) {
                var loadingDiv = $('<div class="loading-bar-hoz loading-bar-' + this.options.loadingPosition + '"><div class="br-timer-glow" style="left: -100px;"></div><div class="br-timer-bar" style="width:0px"></div></div>');
                this.hoverDiv.append(loadingDiv);
                this.loadingBar = $(".br-timer-bar", loadingDiv);
                this.timerGlow  = $(".br-timer-glow", loadingDiv);
            }
            if(this.options.autoPlay && this.options.pauseOnHover) {
                this.hoverDiv.hover(function() {
                    self.pause = true;
                }, function() {
                    self.pause = false;
                });
            }
            // Next, preview arrow
            if (this.options.enableNextPrev) {
                this.arrowButton = $('<div class="mdf-arrow"><div class="mdf-arrow-left"><span></span></div><div class="mdf-arrow-right"><span></span></div></div>');
                this.hoverDiv.append(this.arrowButton);
                $('.mdf-arrow-right', this.arrowButton).bind('click', function () {
                    self.slideNext();
                });
                $('.mdf-arrow-left', this.arrowButton).bind('click', function () {
                    self.slidePrev();
                });
            }
            // Next, Previous with key
            if (this.options.enableKeyNavigation) {
                $(window).keyup(function(event) {
                    var key = event.keyCode || event.which;
                    if (key == 37 || key == 38)
                        self.slidePrev();
                    else if(key == 39 || key == 40)
                        self.slideNext();
                });
            }
            if (this.options.showBullet != false) {
                this.buttons = $('<div class="mdf-bullets" style="opacity:0"></div>');
                this.hoverDiv.append(this.buttons);
                for (var i = 0; i < this.numSlide; i++) {
                    this.buttons.append('<div class="mdf-bullet"  rel="' + i + '"><a></a></div>');
                };
                if (this.options.showThumb && this.options.posThumb == 1) {
                    var thumbW = self.options.thumbWidth,
                        thumbH = self.options.thumbHeight;
                    for (var i = 0; i < this.numSlide; i++) {
                        var thumbSrc = this.slideItems[i].data("thumb");
                        if(thumbSrc) {
                            var top = -(9 + parseInt(thumbH));
                            if (self.options.posBullet == 4 || self.options.posBullet == 5 || self.posBullet == 6)
                                top = 21;
                            var thumb = $('<img />').attr("src", thumbSrc).css({top: top + "px", left: -(thumbW/2 - 2) + "px", opacity: 0, width: thumbW + "px", height: thumbH + "px"});
                            $('div.mdf-bullet:eq(' + i + ')', this.buttons).append(thumb).append('<div class="mdf-thumb-arrow" style="opacity: 0"></div>');
                        }
                    }
                    $('div.mdf-bullet', this.buttons).hover(function () {
                        $(this).addClass('md_hover');
                        var img = $("img", this);
                        if(img.length) {
                            img.show().animate({'opacity':1},200);
                            $('.mdf-thumb-arrow', this).show().animate({'opacity':1}, 200);
                        }
                    }, function () {
                        $(this).removeClass('md_hover');
                        $('img', this).animate({'opacity':0}, 200,function(){
                            $(this).hide();
                        });
                        $('.mdf-thumb-arrow',this).animate({'opacity':0},200,function(){
                            $(this).hide();
                        });
                    });
                }
                $('div.mdf-bullet', self.wrap).click(function () {
                    if ($(this).hasClass('mdf-current')) {
                        return false;
                    };
                    var index = $(this).attr('rel');
                    self.slide(index);
                });
            }
            if (self.options.showThumb && this.options.posThumb != 1) {
                var thumbDiv = $('<div class="mdf-thumb"><div class="mdf-thumb-container"><div class="mdf-thumb-items"></div></div></div>').appendTo(self.hoverDiv);
                self.slideThumb =  $(".mdf-thumb-items", thumbDiv);
                for (var i = 0; i < this.numSlide; i++) {
                    var thumbSrc = self.slideItems[i].data("thumb");
                    if(thumbSrc) {
                        var link = $('<a class="mdf-thumb-item" />').attr("rel", i).append($('<img />').attr("src", thumbSrc).css({width: self.options.thumbWidth + "px", height: self.options.thumbHeight + "px"}));
                        self.slideThumb.append(link);
                    }
                }
                $("a", self.slideThumb).click(function() {
                    if ($(this).hasClass('mdf-current')) {
                        return false;
                    }
                    var index = $(this).attr('rel');
                    self.slide(index);
                });
            }
        },
        responsiveMdf : function($el) {
            var self = this,
                ww = $(window).width(),
                wh = $(window).height();
            $objContent = $el,
                minTop = $objContent.data('minTop'),
                minLeft = $objContent.data('minLeft'),
                maxBottom = $objContent.data('maxBottom'),
                maxRight = $objContent.data('maxRight'),
                contentWidth = $objContent.data('contentWidth'),
                contentHeight = $objContent.data('contentHeight'),
                objTop = 0, objLeft = 0, objScaleX = 0, objScaleY = 0;
            // Set Width
            if (self.options.width < ww) {
                objScaleX = ww /self.options.width;
                objLeft = minLeft  * (ww /self.options.width);
            }
            else if ( contentWidth < ww) {
                var subWidth = self.options.width - ww,
                    ratioLeft = minLeft / (self.options.width - contentWidth);
                objLeft = minLeft - (subWidth * ratioLeft);
                objScaleX = 1;
            }
            else {
                objLeft = 0;
                objScaleX = ww / contentWidth
            }

            // Set Height
            if (self.options.height < wh) {
                objScaleY = wh /self.options.height;
                objTop = minTop  * (wh /self.options.height );
            }
            else if ( contentHeight < wh ) {
                var subHeight = self.options.height - wh,
                    ratioTop = minTop / (self.options.height - contentHeight);
                objTop = minTop - (subHeight * ratioTop);
                objScaleY = 1;
            }
            else {
                objTop = 0;
                objScaleY = wh / contentHeight
            }
            var objScale = objScaleX > objScaleY ? objScaleY : objScaleX;
            $objContent.css({
                'top' : objTop + 'px',
                'left' : objLeft + 'px',
                'webkit-transform' : 'scale('+ objScale +')',
                'moz-transform' : 'scale('+ objScale +')',
                'ms-transform' : 'scale('+ objScale +')',
                'o-transform' : 'scale('+ objScale +')',
                'transform' : 'scale('+ objScale +')'
            });

        },
        initDrag: function() {
            var self = this,
                touchstart = false,
                isScrolling = false,
                mouseleft = 0;
            if(this.hasTouch) {
                this.slider.bind('touchstart', function(event) {
                    if(touchstart) return false;
                    event = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
                    touchstart = true;
                    isScrolling = undefined;
                    self.mouseY = event.pageY;
                    self.mouseX = event.pageX;
                });
                this.slider.bind('touchmove', function (event) {
                    event = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
                    if (touchstart) {
                        var pageX = (event.pageX || event.clientX);
                        var pageY = (event.pageY || event.clientY);

                        if ( typeof isScrolling == 'undefined') {
                            isScrolling = !!( isScrolling || Math.abs(pageY - self.mouseY) > Math.abs( pageX - self.mouseX ) )
                        }
                        if (isScrolling ) {
                            touchstart = false;
                            return
                        } else {
                            mouseleft = pageX - self.mouseX;
                            return false;
                        }
                    };
                    return ;
                });
                this.slider.bind('touchend', function() {
                    if(touchstart) {
                        touchstart = false;
                        if(mouseleft > self.options.touchSensitive) {
                            self.slidePrev();
                            mouseleft = 0;
                            return false;
                        } else if(mouseleft < - self.options.touchSensitive) {
                            self.slideNext();
                            mouseleft = 0;
                            return false;
                        }
                    }
                });
            } else {
                if (this.options.hoverNextPrev) {
                    this.hoverDiv.hover(function() {
                        if (self.arrowButton) {
                            $(".mdf-arrow-left", self.arrowButton).stop(true, true).animate({left: '10px', opacity:1}, 200);
                            $(".mdf-arrow-right", self.arrowButton).stop(true, true).animate({right: '10px', opacity:1}, 200);
                        }
                    }, function() {
                        if (self.arrowButton) {
                            $(".mdf-arrow-left", self.arrowButton).stop(true, true).animate({left: '-40px', opacity:0}, 200);
                            $(".mdf-arrow-right", self.arrowButton).stop(true, true).animate({right: '-40px', opacity:0}, 200);
                        }
                    });
                }
                else {
                    $(".mdf-arrow-left", self.arrowButton).stop(true, true).animate({left: '10px', opacity:1}, 200);
                    $(".mdf-arrow-right", self.arrowButton).stop(true, true).animate({right: '10px', opacity:1}, 200);
                }

                if (this.options.showBullet) {
                    if (this.options.hoverBullet) {
                        this.hoverDiv.hover(
                            function() {
                                if (self.buttons)
                                    self.buttons.animate({opacity: 1}, 200);
                            },
                            function(){
                                if (self.buttons)
                                    self.buttons.animate({opacity: 0}, 200);
                            }
                        );
                    }
                    else {
                        self.buttons.animate({opacity: 1}, 200);
                    }
                }
                this.wrap.trigger("hover");
            }

            if (this.options.enableDrag) {
                this.slider.mousedown(function (event) {
                    if (!touchstart) {
                        touchstart = true;
                        isScrolling = undefined;
                        self.mouseY = event.pageY;
                        self.mouseX = event.pageX;
                    }
                    return false;
                });
                this.slider.mousemove(function (event) {
                    if (touchstart) {
                        var pageX = (event.pageX || event.clientX);
                        var pageY = (event.pageY || event.clientY);

                        if ( typeof isScrolling == 'undefined') {
                            isScrolling = !!( isScrolling || Math.abs(pageY - self.mouseY) > Math.abs( pageX - self.mouseX ) )
                        }
                        if (isScrolling ) {
                            touchstart = false;
                            return
                        } else {
                            mouseleft = pageX - self.mouseX;
                            return false;
                        }
                    };
                    return ;
                });
                this.slider.mouseup(function () {
                    if(touchstart) {
                        touchstart = false;
                        if(mouseleft > self.options.touchSensitive) {
                            self.slidePrev();
                        } else if(mouseleft < - self.options.touchSensitive) {
                            self.slideNext();
                        }
                        mouseleft = 0;
                        return false;
                    }
                });
                this.slider.mouseleave(function () {
                    self.slider.mouseup();
                });
            }
        },
        documentHasTouch: function() {
            return ('ontouchstart' in window || 'createTouch' in document);
        },
        slideReady: function() {
            this.slider.removeClass("loading-image");
            this.resizeWindow();
            this.slide(0);
            if(!this.timer)
                this.setTimer();
        },
        setTimer: function() {
            var self = this;
            this.timer = setInterval(function() {self.next()}, 40);
        },
        clearTimer: function() {
            if(!this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
        },
        next: function() {
            if(this.lock) return;
            if(this.play && !this.pause) {
                this.step += 40;
                if(this.step > this.slideShowDelay) {
                    this.slideNext();
                } else if(this.loadingBar) {
                    var width = this.step * this.slideWidth / this.slideShowDelay;
                    this.loadingBar.width(width);
                    this.timerGlow.css({left: width - 100 + 'px'});
                }
            }
        },
        slide: function(index) {
            if (!this.slideItems[index])
                return;

            var self = this,
                transitionSpeed = this.slideItems[index].data("transition_time") ? this.slideItems[index].data("transition_time") : self.options.transitionsSpeed;

            this.step = 0;
            this.slideShowDelay = this.slideItems[index].data("timeout") ? this.slideItems[index].data("timeout") : this.options.slideShowDelay;
            if(this.loadingBar) {
                var width = this.step * this.slideWidth / this.slideShowDelay;
                this.loadingBar.width(width);
                this.timerGlow.css({left: width - 100 + 'px'});
            }
            this.oIndex = this.activeIndex;
            this.activeIndex = index;
            this.options.onStartTransition.call(self);
            if (this.slideItems[this.oIndex]) {
                this.removeTheCaptions(this.slideItems[this.oIndex]);
                //Custom transition as defined by "data-transition" attribute
                var fx = this.slideItems[this.activeIndex].data('transition'), trans;
                if (!fx) {
                    fx = this.options.transitions;
                }

                if (fx.toLowerCase() == 'random') {
                    trans = this.transitions;
                    fx = trans[Math.floor(Math.random() * (trans.length + 1))];
                } else if (fx.indexOf(',') != -1) {
                    trans = fx.split(',');
                    fx = trans[Math.floor(Math.random() * (trans.length))];
                }
                if(!this.supportCss3 && (jQuery.inArray(fx, this.css3Transitions) > -1)) {
                    fx = 'fade';
                }
                if (fx == undefined) fx = 'fade';
                fx = $.trim(fx);
                var fxs = fx.split('-'), condition = (fxs[1] != undefined) ? fxs[1] : null;
                fx = fxs[0];
                this.lock = true;
                if($.fn.mdFullScreenSlider.fxTransitions[fx] != undefined) {
                    $.fn.mdFullScreenSlider.fxTransitions[fx](self, condition, transitionSpeed);
                } else {
                    $.fn.mdFullScreenSlider.fxTransitions['fade'](self, transitionSpeed);
                }
            } else {
                this.slideItems[this.activeIndex].fadeIn();
                this.animateTheCaptions(this.slideItems[index]);
                this.lock = false;
            }
            if(self.buttons) {
                $('div.mdf-bullet.mdf-current', self.buttons).removeClass('mdf-current');
                $('div.mdf-bullet:eq(' + self.activeIndex + ')', self.buttons).addClass('mdf-current');
            }
            if(self.slideThumb) {
                $('a.mdf-current', self.slideThumb).removeClass('mdf-current');
                $('a:eq(' + self.activeIndex + ')', self.slideThumb).addClass('mdf-current');
            }
        },
        slideNext: function() {
            if(this.lock) return;
            var index = this.activeIndex;
            index++;
            if(index >= this.numSlide && this.options.loop) {
                index = 0;
                this.slide(index);
            } else if(index < this.numSlide) {

                this.slide(index);
            }
        },
        slidePrev: function() {
            if(this.lock) return;
            var index = this.activeIndex;
            index--;
            if(index < 0 && this.options.loop) {
                index = this.numSlide - 1;
                this.slide(index);
            } else if(index >= 0) {
                this.slide(index);
            }
        },
        endMoveCaption: function(caption) {
            clearTimeout(caption.data('timer-start'));
            if (!this.supportCss3) {
                caption.fadeOut();
            } else {
                caption.removeClass(effectsIn.join(' '));
                var easeout = caption.data("easeout");
                if(easeout) {
                    if(easeout == "random")
                        easeout = effectsOut[Math.floor(Math.random() * e_out_length)];
                    if(caption.data("out-time") != undefined) {
                        var outTime = caption.data("out-time"),
                            transitionProp = {
                                'animation-duration': outTime + 'ms',
                                '-webkit-animation-duration': outTime + 'ms',
                                '-moz-animation-duration': outTime + 'ms',
                                '-ms-animation-duration': outTime + 'ms'
                            };
                        caption.css(transitionProp);
                    }
                    caption.addClass(easeout);

                } else {
                    caption.hide();
                }
            }
        },
        removeTheCaptions: function(oItem) {
            oItem.find(".mdf-object").each(function() {
                var caption = $(this);
                caption.stop(true, true).hide();
                clearTimeout(caption.data('timer-start'));
                clearTimeout(caption.data('timer-stop'));
            });
        },
        animateTheCaptions: function(nextItem) {
            var self = this;
            $(".mdf-object", nextItem).each(function () {
                var caption = $(this);
                if(caption.data("easeout"))
                    caption.removeClass(effectsOut.join(' '));
                var easein = caption.data("easein") ? caption.data("easein") : "";
                if(easein == "random")
                    easein = effectsIn[Math.floor(Math.random() * e_in_length)];

                caption.removeClass(effectsIn.join(' '));
                caption.hide();
                if(caption.data("start") != undefined) {
                    caption.data('timer-start', setTimeout(function() {
                        if (easein == "" || !self.supportCss3) {
                            caption.fadeIn();
                        } else {
                            if(caption.data("in-time") != undefined) {
                                var intime = caption.data("in-time"),
                                    transitionProp = {
                                        'animation-duration': intime + 'ms',
                                        '-webkit-animation-duration': intime + 'ms',
                                        '-moz-animation-duration': intime + 'ms',
                                        '-ms-animation-duration': intime + 'ms'
                                    };
                                caption.css(transitionProp);
                            }
                            caption.show().addClass(easein);
                        }

                    }, caption.data("start")));
                } else {
                    caption.show().addClass(easein);
                }

                if(caption.data("stop") != undefined) {
                    caption.data('timer-stop', setTimeout(function() {
                        self.endMoveCaption(caption);
                    }, caption.data('stop')));
                }
            });
        },
        //When Animation finishes
        transitionEnd: function() {
            this.options.onEndTransition.call(this);
            $('.mdf-strips-container', this.slider).remove();
            this.slideItems[this.oIndex].hide();
            this.slideItems[this.activeIndex].show();
            this.lock = false;
            this.animateTheCaptions(this.slideItems[this.activeIndex]);
        },
        // Add strips
        addTwoStrips: function(bgColor) {
            var strip,
                images = [$(".mdf-mainimg img", this.slideItems[this.oIndex]), $(".mdf-mainimg img", this.slideItems[this.activeIndex])];
            var stripsContainer = $('<div class="mdf-strips-container"></div>').css("background-color", bgColor),
                $overlay = $('.md-full-overlay',this.slideItems[this.activeIndex]);
            if ($overlay.length) {
                var $overlayStrips = $overlay.clone();
                stripsContainer.append($overlayStrips);
            }
            for (var i = 0; i < 2; i++) {
                strip = $('<div class="mdslider-strip"></div>').css({
                    width: this.slideWidth,
                    height: this.slideHeight
                }).append(images[i].clone());
                stripsContainer.append(strip);
            }
            this.slider.append(stripsContainer);
        },
        // Add strips
        addSlits: function(fx) {
            var $stripsContainer = $('<div class="mdf-strips-container ' + fx + '"></div>'),
                $image = $(".mdf-mainimg img", this.slideItems[this.oIndex]),
                $div1 = $('<div class="mdf-slider-slit"/>').append($image.clone()),
                position = $image.position(),
                $div2 = $('<div class="mdf-slider-slit"/>').append($image.clone().css("top", position.top - (this.slideHeight/2) + "px")),
                $overlay = $('.md-full-overlay',this.slideItems[this.activeIndex]);
            if ($overlay.length) {
                var $overlayStrips = $overlay.clone();
                $stripsContainer.append($overlayStrips);
            }
            if(fx == "slit-vertical-down" || fx == "slit-vertical-up")
                $div2 = $('<div class="mdf-slider-slit"/>').append($image.clone().css("left", position.left - (this.slideWidth/2) + "px"));

            $stripsContainer.append($div1).append($div2);
            this.slider.append($stripsContainer);
        },
        addTiles: function(x, y, index) {
            var tile;
            var stripsContainer = $('<div class="mdf-strips-container"></div>');
            var tileWidth = this.slideWidth / x,
                tileHeight = this.slideHeight / y,
                $image = $(".mdf-mainimg img", this.slideItems[index]),
                $overlay = $('.md-full-overlay',this.slideItems[index]);

            for(var i = 0; i < y; i++) {
                for(var j = 0; j < x; j++) {
                    var top = (tileHeight * i) + 'px',
                        left = (tileWidth * j) + 'px';
                    tile = $('<div class="mdslider-tile"/>').css({
                        width: tileWidth,
                        height: tileHeight,
                        top: top,
                        left: left
                    }).append($image.clone().css({
                        marginLeft: "-" + left,
                        marginTop: "-" + top
                    }));
                    stripsContainer.append(tile);
                }
            }
            if ($overlay.length) {
                var $overlayStrips = $('<div class="md-full-overlay"></div>');/*$overlay.clone();*/
                $overlayStrips.css('background-color', $overlay.css('background-color'));
                stripsContainer.append($overlayStrips);
            }

            this.slider.append(stripsContainer);
        },
        addTwoTiles: function(x, y) {
            var tileold, tilenew;
            var stripsContainer = $('<div class="mdf-strips-container"></div>');
            var tileWidth = this.slideWidth / x,
                tileHeight = this.slideHeight / y,
                $oimage = $(".mdf-mainimg img", this.slideItems[this.oIndex]),
                $nimage = $(".mdf-mainimg img", this.slideItems[this.activeIndex]),
                $overlay = $('.md-full-overlay',this.slideItems[this.activeIndex]);
            if ($overlay.length) {
                var $overlayStrips = $overlay.clone();
                stripsContainer.append($overlayStrips);
            }
            for(var i = 0; i < y; i++) {
                for(var j = 0; j < x; j++) {
                    var top = (tileHeight * i) + 'px',
                        left = (tileWidth * j) + 'px';
                    tileold = $('<div class="mdslider-tile-old"/>').css({
                        width: tileWidth,
                        height: tileHeight
                    }).append($oimage.clone().css({
                        marginLeft: "-" + left,
                        marginTop: "-" + top
                    }));
                    tilenew = $('<div class="mdslider-tile-new"/>').css({
                        width: tileWidth,
                        height: tileHeight
                    }).append($nimage.clone().css({
                        marginLeft: "-" + left,
                        marginTop: "-" + top
                    }));
                    stripsContainer.append($('<div class="mdslider-tile"/>').css({
                        width: tileWidth,
                        height: tileHeight,
                        top: top,
                        left: left
                    }).append(tileold, tilenew));
                }
            }
            this.slider.append(stripsContainer);
        },
        setWrapSize: function() {

            if(this.options.wrapHeight.indexOf('-') == 0) {
                this.wrap.height($(window).height() + parseInt(this.options.wrapHeight));
            } else if (this.options.wrapHeight.indexOf('%') >= 0) {
                this.wrap.height(parseInt(this.options.wrapHeight) * $(window).height() / 100);
            } else {
                this.wrap.height(this.options.wrapHeight);
            }
            if(this.options.wrapWidth.indexOf('-') == 0) {
                this.wrap.width($(window).width() + parseInt(this.options.wrapWidth));
            } else if (this.options.wrapWidth.indexOf('%') >= 0) {
                this.wrap.width(parseInt(this.options.wrapWidth) * $(window).width() / 100);
            } else {
                this.wrap.width(this.options.wrapWidth);
            }
            // Apply callback resize
            this.wrap.trigger('updateWrapSize');

        },
        resizeWindow: function() {
            var _self = this;
            this.setWrapSize();
            this.resizeBackgroundImage();
            $.each($(".mdf-objects", this.slider), function(){
                var $objContent = $('.mdf-objects-content', this);
                _self.responsiveMdf($objContent);
            });
            this.slideWidth = this.wrap.width();
            this.slideHeight = this.wrap.height();
        },
        resizeBackgroundImage: function() {
            var self = this,
                hoverDivH = self.hoverDiv.height();
            $(".mdf-slide-item", this.slider).each(function() {
                var $background = $(".mdf-mainimg img", this);
                if($background.data("defW") && $background.data("defH")) {
                    var width = $background.data("defW"),
                        height = $background.data("defH");
                    self.changeImagePosition($background, width, height);

                }
            });

            if (self.options.posThumb == 4 || self.options.posThumb == 5) {
                var thumbH = self.options.thumbHeight;
                $(".mdf-thumb-container", self.hoverDiv).css("margin-top", (hoverDivH-thumbH)/2);
            }
            if (self.options.showBullet && self.options.showThumb && self.options.posThumb == 1) {
                $('div.mdf-bullet', this.buttons).hover(function () {
                    var img = $("img", this);
                    if(img.length) {
                        var hoverDiv = self.hoverDiv.offset(),
                            hover = $(this).offset(),
                            thumbW = self.options.thumbWidth,
                            left = hover.left - hoverDiv.left,
                            right = hoverDiv.left + self.hoverDiv.width() - hover.left - $(this).width();

                        if (left < thumbW/2-2)
                            img.css({left: -(left - 2) +"px"});
                        else if (right < thumbW/2-2)
                            img.css({position: "absolute", right: -(right-2) +"px", left: "auto"});
                    }
                });
            }
        },
        preloadCompete: function() {
            this.options.onInit.call(this);
            var self = this;
            $(".mdf-slide-item .mdf-mainimg img", this.slider).each(function() {
                var $image = $(this);
                if(!$image.data('defW')) {
                    $image.load(function() {
                        var dimensions = self.getImgSize($image.attr("src"));
                        self.changeImagePosition($image, dimensions.width, dimensions.height);
                        $image.data({
                            'defW': dimensions.width,
                            'defH': dimensions.height
                        });
                    });
                    if(this.complete) $image.load();
                }
            });
            this.slideReady();
        },
        changeImagePosition: function($background, width, height) {
            var panelWidth = $(".mdf-slide-item:visible", this.slider).width(),
                panelHeight = $(".mdf-slide-item:visible", this.slider).height();

            if(height > 0 && panelHeight > 0) {
                if (((width / height) > (panelWidth / panelHeight))) {
                    var left = panelWidth - (panelHeight / height) * width;
                    $background.css({width: "auto", height: panelHeight + "px"});
                    if(left < 0) {
                        $background.css({left: (left/2) + "px", top: 0 });
                    } else {
                        $background.css({left: 0, top: 0 });
                    }
                } else {
                    var top = panelHeight - (panelWidth / width) * height;
                    $background.css({width: panelWidth + "px", height: "auto"});
                    if(top < 0) {
                        $background.css({top: (top/2) + "px", left: 0 });
                    } else {
                        $background.css({left: 0, top: 0 });
                    }
                }
            }
        },
        resizeFontSize: function(width) {
            var fontDiff = (this.supportCss3) ? 1 : 6,
                ratio = 100*width / this.options.width - fontDiff;

            $(".mdf-objects", this.slider).css({'font-size': ratio + '%'});
            $(".mdf-objects", this.slider).css({'line-height': ratio + '%'});
        },
        resizePadding: function() {
            var self = this;
            if (this.wrap.width() < this.options.width) {
                $(".mdf-objects > div", this.slider).each(function() {
                    var objectRatio = self.wrap.width() / self.options.width,
                        $_object = $(this),
                        objectPadding = {};
                    if ($_object.data('padding-top')) objectPadding['padding-top'] = $_object.data('padding-top') * objectRatio;
                    if ($_object.data('padding-right')) objectPadding['padding-right'] = $_object.data('padding-right') * objectRatio;
                    if ($_object.data('padding-bottom')) objectPadding['padding-bottom'] = $_object.data('padding-bottom') * objectRatio;
                    if ($_object.data('padding-left')) objectPadding['padding-left'] = $_object.data('padding-left') * objectRatio;
                    if ($_object.find('a').length) {
                        $_object.find('a').css(objectPadding);
                    } else {
                        $_object.css(objectPadding);
                    }
                })
            } else {
                $(".mdf-objects > div", this.slider).each(function() {
                    var $_object = $(this),
                        objectPadding = {};
                    if ($_object.data('padding-top')) objectPadding['padding-top'] = $_object.data('padding-top');
                    if ($_object.data('padding-right')) objectPadding['padding-right'] = $_object.data('padding-right');
                    if ($_object.data('padding-bottom')) objectPadding['padding-bottom'] = $_object.data('padding-bottom');
                    if ($_object.data('padding-left')) objectPadding['padding-left'] = $_object.data('padding-left');
                    if ($_object.find('a').length) {
                        $_object.find('a').css(objectPadding);
                    } else {
                        $_object.css(objectPadding);
                    }
                })
            }
        },
        getImgSize: function(imgSrc) {
            var newImg = new Image();
            newImg.src = imgSrc;
            return {height: newImg.height, width: newImg.width};
        },
        focusWindow: function() {
            var self = this, blurtime;
            $(window).blur(function(){
                blurtime = (new Date()).getTime();
            });
            $(window).focus(function(){
                if(blurtime) {
                    var duration = (new Date()).getTime() - blurtime;
                    if(duration > self.slideShowDelay - self.step) {
                        self.step = self.slideShowDelay - 400;
                    } else {
                        self.step += duration;
                    }
                    blurtime = false;
                }
            });
        }
    };

    $.fn.mdFullScreenSlider = function(options) {
        return new MdFullScreenSlider($(this), options);
    };

    $.fn.mdFullScreenSlider.fxTransitions = {
        "fade": function(self, transitionSpeed) {
            self.addTiles(1, 1, self.activeIndex);
            var strip = $('.mdslider-tile', self.slider);
            strip.css({opacity: 0});
            strip.animate({
                opacity: 1
            }, transitionSpeed, function () {
                self.transitionEnd();
            });
        },
        'slit': function(self, condition, transitionSpeed) {
            var className = "";
            switch (condition) {
                case 'horizontalLeftTop':
                    className = 'slit-horizontal-left-top';
                    break;
                case 'horizontalTopRight':
                    className = 'slit-horizontal-top-right';
                    break;
                case 'horizontalBottomUp':
                    className = 'slit-horizontal-bottom-up';
                    break;
                case 'verticalDown':
                    className = 'slit-vertical-down';
                    break;
                case 'verticalUp':
                    className = 'slit-vertical-up';
                    break;
            }
            self.addSlits(className);
            $(".mdf-object", self.slideItems[self.activeIndex]).hide();
            self.slideItems[self.oIndex].hide();
            self.slideItems[self.activeIndex].show();
            var slice1 = $('.mdf-slider-slit', self.slider).first(),
                slice2 = $('.mdf-slider-slit', self.slider).last();
            var transitionProp = {
                'transition' : 'all ' + transitionSpeed + 'ms ease-in-out',
                '-webkit-transition' : 'all ' + transitionSpeed + 'ms ease-in-out',
                '-moz-transition' : 'all ' + transitionSpeed + 'ms ease-in-out',
                '-ms-transition' : 'all ' + transitionSpeed + 'ms ease-in-out'
            };
            $('.mdf-slider-slit', self.slider).css(transitionProp);
            setTimeout( function() {
                slice1.addClass("mdf-trans-elems-1");
                slice2.addClass("mdf-trans-elems-2");
            }, 50 );
            setTimeout(function() {
                self.options.onEndTransition.call(self);
                $('.mdf-strips-container', self.slider).remove();
                self.lock = false;
                self.animateTheCaptions(self.slideItems[self.activeIndex]);
            }, transitionSpeed);
        },
        'stripUp': function(self, condition, transitionSpeed) {
            self.addTiles(self.options.stripCols, 1, self.activeIndex);
            var strips = (condition == 'left') ? $('.mdslider-tile', self.slider) : $('.mdslider-tile', self.slider).reverse(),
                timeStep = transitionSpeed / self.options.stripCols / 2,
                speed = transitionSpeed / 2;
            strips.css({
                height: '1px',
                bottom: '0px',
                top: "auto"
            });
            strips.each(function (i) {
                var strip = $(this);
                setTimeout(function () {
                    strip.animate({
                        height: '100%',
                        opacity: '1.0'
                    }, speed, 'easeInOutQuart', function () {
                        if (i == self.options.stripCols - 1) self.transitionEnd();
                    });
                }, (i + 1) * timeStep);
            });
        },
        'stripDown': function(self, condition, transitionSpeed) {
            self.addTiles(self.options.stripCols, 1, self.activeIndex);
            var strips = (condition == 'left') ? $('.mdslider-tile', self.slider) : $('.mdslider-tile', self.slider).reverse(),
                timeStep = transitionSpeed / self.options.stripCols / 2,
                speed = transitionSpeed / 2;
            strips.css({
                height: '1px',
                top: '0px',
                bottom: "auto"
            });
            strips.each(function (i) {
                var strip = $(this);
                setTimeout(function () {
                    strip.animate({
                        height: '100%',
                        opacity: '1.0'
                    }, speed, 'easeInOutQuart', function () {
                        if (i == self.options.stripCols - 1) self.transitionEnd();
                    });
                }, (i + 1) * timeStep);
            });
        },
        'stripLeft': function(self, condition, transitionSpeed) {
            self.addTiles(1, self.options.stripRows, self.activeIndex);
            var strips = (condition == 'up') ? $('.mdslider-tile', self.slider) : $('.mdslider-tile', self.slider).reverse(),
                timeStep = transitionSpeed / self.options.stripRows / 2,
                speed = transitionSpeed / 2;
            strips.css({
                width: '1px',
                left: '0px',
                right: "auto"
            });
            strips.each(function (i) {
                var strip = $(this);
                setTimeout(function () {
                    strip.animate({
                        width: '100%',
                        opacity: '1.0'
                    }, speed, 'easeInOutQuart', function () {
                        if (i == self.options.stripRows - 1) self.transitionEnd();
                    });
                }, (i + 1) * timeStep);
            });
        },
        'stripRight':  function(self, condition, transitionSpeed) {
            self.addTiles(1, self.options.stripRows, self.activeIndex);
            var strips = (condition == 'up') ? $('.mdslider-tile', self.slider) : $('.mdslider-tile', self.slider).reverse(),
                timeStep = transitionSpeed / self.options.stripRows / 2,
                speed = transitionSpeed / 2;
            strips.css({
                width: '1px',
                left: 'auto',
                right: "1px"
            });
            strips.each(function (i) {
                var strip = $(this);
                setTimeout(function () {
                    strip.animate({
                        width: '100%',
                        opacity: '1.0'
                    }, speed, 'easeInOutQuart', function () {
                        if (i == self.options.stripRows - 1) self.transitionEnd();
                    });
                }, (i + 1) * timeStep);
            });
        },
        'stripRightLeft': function(self, condition, transitionSpeed) {
            self.addTiles(1, self.options.stripRows, self.oIndex);
            self.slideItems[self.oIndex].hide();
            self.slideItems[self.activeIndex].show();
            var strips = (condition == 'down') ? $('.mdslider-tile', self.slider) : $('.mdslider-tile', self.slider).reverse(),
                timeStep = transitionSpeed / self.options.stripRows / 2,
                speed = transitionSpeed / 2;
            strips.filter(":odd").css({
                width: '100%',
                right: '0px',
                left: "auto",
                opacity: 1
            }).end().filter(':even').css({
                width: '100%',
                right: 'auto',
                left: "0px",
                opacity: 1
            });
            strips.each(function (i) {
                var strip = $(this);
                var css = (i%2 == 0) ? {left: '-50%',opacity: '0'} : {right: '-50%', opacity: '0'};
                setTimeout(function () {
                    strip.animate(css, speed, 'easeOutQuint', function () {
                        if (i == self.options.stripRows - 1) {
                            self.options.onEndTransition.call(self);
                            $('.mdf-strips-container', self.slider).remove();
                            self.lock = false;
                            self.animateTheCaptions(self.slideItems[self.activeIndex]);
                        }
                    });
                }, (i + 1) * timeStep);
            });
        },
        'stripUpDown': function(self, condition, transitionSpeed) {
            self.addTiles(self.options.stripCols, 1, self.oIndex);
            self.slideItems[self.oIndex].hide();
            self.slideItems[self.activeIndex].show();
            var strips = (condition == 'right') ? $('.mdslider-tile', self.slider) : $('.mdslider-tile', self.slider).reverse(),
                timeStep = transitionSpeed / self.options.stripCols / 2,
                speed = transitionSpeed / 2;
            strips.filter(':odd').css({
                height: '100%',
                bottom: '0px',
                top: "auto",
                opacity: 1
            }).end().filter(':even').css({
                height: '100%',
                bottom: 'auto',
                top: "0px",
                opacity: 1
            });
            strips.each(function (i) {
                var strip = $(this);
                var css = (i%2 == 0) ? {top: '-50%',opacity: 0} : {bottom: '-50%', opacity: 0};
                setTimeout(function () {
                    strip.animate(css, speed, 'easeOutQuint', function () {
                        if (i == self.options.stripCols - 1) {
                            self.options.onEndTransition.call(self);
                            $('.mdf-strips-container', self.slider).remove();
                            self.lock = false;
                            self.animateTheCaptions(self.slideItems[self.activeIndex]);
                        }
                    });
                }, (i + 1) * timeStep);
            });
        },
        'curtainX': function(self, condition, transitionSpeed) {
            self.addTiles(self.options.stripCols, 1, self.activeIndex);
            var strips = (condition == 'left') ? $('.mdslider-tile', self.slider) : $('.mdslider-tile', self.slider).reverse(),
                width = self.slideWidth / self.options.stripCols,
                timeStep = transitionSpeed / self.options.stripCols / 2,
                speed = transitionSpeed / 2;
            strips.each(function (i) {
                var strip = $(this);
                strip.css({right: width * i, left: "auto", width: 0, opacity: 0});
                setTimeout(function () {
                    strip.animate({
                        width: width,
                        opacity: '1.0'
                    }, speed, function () {
                        if (i == self.options.stripCols - 1) self.transitionEnd();
                    });
                }, timeStep * (i + 1));
            });
        },
        'curtainY': function(self, condition, transitionSpeed) {
            self.addTiles(1, self.options.stripRows, self.activeIndex);
            var strips = (condition == 'top') ? $('.mdslider-tile', self.slider) : $('.mdslider-tile', self.slider).reverse(),
                height = self.slideHeight / self.options.stripRows,
                timeStep = transitionSpeed / self.options.stripRows / 2;
            strips.each(function (i) {
                var strip = $(this);
                strip.css({height: 0, opacity: 0});
                setTimeout(function () {
                    strip.animate({
                        height: height,
                        opacity: '1.0'
                    }, transitionSpeed / 2, function () {
                        if (i == self.options.stripRows - 1) self.transitionEnd();
                    });
                }, timeStep * (i + 1));
            });
        },
        'slideInRight': function(self, transitionSpeed) {
            var i = 0;
            self.addTwoStrips();
            var strips = $('.mdslider-strip', self.slider);
            strips.each(function() {
                var strip = $(this);
                var left = i * self.slideWidth;
                strip.css({left: left});
                strip.animate({
                    left: left - self.slideWidth
                }, transitionSpeed, function () {
                    self.transitionEnd();
                });
                i++;
            });
        },
        'slideInLeft': function(self, transitionSpeed) {
            var i = 0;
            self.addTwoStrips();
            var strips = $('.mdslider-strip', self.slider);
            strips.each(function() {
                var strip = $(this);
                var left = -i * self.slideWidth;
                strip.css({
                    left: left
                });
                strip.animate({
                    left: self.slideWidth + left
                }, transitionSpeed, function () {
                    self.transitionEnd();
                });
                i++;
            });
        },
        'slideInUp': function(self, transitionSpeed) {
            var i = 0;
            self.addTwoStrips();
            var strips = $('.mdslider-strip', self.slider);
            strips.each(function() {
                var strip = $(this);
                var top = i * self.slideHeight;
                strip.css({
                    top: top
                });
                strip.animate({
                    top: top - self.slideHeight
                }, transitionSpeed, function () {
                    self.transitionEnd();
                });
                i++;
            });
        },
        'slideInDown': function(self, transitionSpeed) {
            var i = 0;
            self.addTwoStrips();
            var strips = $('.mdslider-strip', self.slider);
            strips.each(function() {
                var strip = $(this);
                var top = -i * self.slideHeight;
                strip.css({
                    top: top
                });
                strip.animate({
                    top: self.slideHeight + top
                }, transitionSpeed, function () {
                    self.transitionEnd();
                });
                i++;
            });
        }
    };
    $.fn.mdFullScreenSlider.transitions = [
        'fade',
        'slit-horizontalLeftTop',
        'slit-horizontalTopRight',
        'slit-horizontalBottomUp',
        'slit-verticalDown',
        'slit-verticalUp',
        'stripUp-left',
        'stripUp-right',
        'stripDown-left',
        'stripDown-right',
        'stripLeft-up',
        'stripLeft-down',
        'stripRight-up',
        'stripRight-down',
        'stripRightLeft-up',
        'stripRightLeft-down',
        'stripUpDown-left',
        'stripUpDown-right',
        'curtainX-left',
        'curtainX-right',
        'curtainY-up',
        'curtainY-down',
        'slideInRight',
        'slideInLeft',
        'slideInUp',
        'slideInDown'
    ];
    $.fn.mdFullScreenSlider.css3Transitions = [
        'slit-horizontalLeftTop',
        'slit-horizontalTopRight',
        'slit-horizontalBottomUp',
        'slit-verticalDown',
        'slit-verticalUp'
    ];
    $.fn.reverse = [].reverse;
})(jQuery);
;
/**
 * Created with magedrupal.com.
 * User: baonv
 * Date: 8/19/13
 * Time: 4:21 PM
 */
(function ($) {
    var animEndEventNames = {
        'WebkitAnimation' : 'webkitAnimationEnd',
        'OAnimation' : 'oAnimationEnd',
        'msAnimation' : 'MSAnimationEnd',
        'animation' : 'animationend'
        },
        animEndEventName = animEndEventNames[window.Modernizr.prefixed('animation')];
    /*
     */
    function getInOutClass(animation) {
        var outClass, inClass, delay = 0;
        switch(animation) {
            case 'moveRightLeftEasing':
                outClass = 'pt-page-moveToLeftEasing pt-page-ontop';
                inClass = 'pt-page-moveFromRight';
                break;
            case 'moveLeftTopEasing':
                outClass = 'pt-page-moveToRightEasing pt-page-ontop';
                inClass = 'pt-page-moveFromLeft';
                break;
            case 'moveBottomTopEasing':
                outClass = 'pt-page-moveToTopEasing pt-page-ontop';
                inClass = 'pt-page-moveFromBottom';
                break;
            case 'moveFromTopMoveToBottomEasing':
                outClass = 'pt-page-moveToBottomEasing pt-page-ontop';
                inClass = 'pt-page-moveFromTop';
                break;
            case 'moveRightScaleDown':
                outClass = 'pt-page-scaleDown';
                inClass = 'pt-page-moveFromRight pt-page-ontop';
                break;
            case 'moveLeftScaleDown':
                outClass = 'pt-page-scaleDown';
                inClass = 'pt-page-moveFromLeft pt-page-ontop';
                break;
            case 'moveBottomScaleDown':
                outClass = 'pt-page-scaleDown';
                inClass = 'pt-page-moveFromBottom pt-page-ontop';
                break;
            case 'moveTopScaleDown':
                outClass = 'pt-page-scaleDown';
                inClass = 'pt-page-moveFromTop pt-page-ontop';
                break;
            case 'scaleUpDownScaleDown':
                outClass = 'pt-page-scaleDown';
                inClass = 'pt-page-scaleUpDown pt-page-delay300';
				delay = 300;
                break;
            case 'scaleUpScaleDownUp':
                outClass = 'pt-page-scaleDownUp';
                inClass = 'pt-page-scaleUp pt-page-delay300';
				delay = 300;
                break;
            case 'scaleUpMoveToLeft':
                outClass = 'pt-page-moveToLeft pt-page-ontop';
                inClass = 'pt-page-scaleUp';
                break;
            case 'scaleUpMoveToRight':
                outClass = 'pt-page-moveToRight pt-page-ontop';
                inClass = 'pt-page-scaleUp';
                break;
            case 'scaleUpMoveToTop':
                outClass = 'pt-page-moveToTop pt-page-ontop';
                inClass = 'pt-page-scaleUp';
                break;
            case 'scaleUpMoveToBottom':
                outClass = 'pt-page-moveToBottom pt-page-ontop';
                inClass = 'pt-page-scaleUp';
                break;
            case 'scaleUpCenterScaleDownCenter':
                outClass = 'pt-page-scaleDownCenter';
                inClass = 'pt-page-scaleUpCenter pt-page-delay400';
				delay = 400;
                break;
            case 'moveFromRightRotateRightSideFirst':
                outClass = 'pt-page-rotateRightSideFirst';
                inClass = 'pt-page-moveFromRight pt-page-delay200 pt-page-ontop';
                break;
            case 'moveFromLeftRotateLeftSideFirst':
                outClass = 'pt-page-rotateLeftSideFirst';
                inClass = 'pt-page-moveFromLeft pt-page-delay200 pt-page-ontop';
                break;
            case 'moveFromTopRotateTopSideFirst':
                outClass = 'pt-page-rotateTopSideFirst';
                inClass = 'pt-page-moveFromTop pt-page-delay200 pt-page-ontop';
                break;
            case 'moveFromBottomRotateBottomSideFirst':
                outClass = 'pt-page-rotateBottomSideFirst';
                inClass = 'pt-page-moveFromBottom pt-page-delay200 pt-page-ontop';
                break;
            case 'flipInLeftFlipOutRight':
                outClass = 'pt-page-flipOutRight';
                inClass = 'pt-page-flipInLeft pt-page-delay500';
				delay = 500;
                break;
            case 'flipInRightFlipOutLeft':
                outClass = 'pt-page-flipOutLeft';
                inClass = 'pt-page-flipInRight pt-page-delay500';
				delay = 500;
                break;
            case 'flipInBottomFlipOutTop':
                outClass = 'pt-page-flipOutTop';
                inClass = 'pt-page-flipInBottom pt-page-delay500';
				delay = 500;
                break;
            case 'flipInTopFlipOutBottom':
                outClass = 'pt-page-flipOutBottom';
                inClass = 'pt-page-flipInTop pt-page-delay500';
				delay = 500;
                break;
            case 'scaleUpRotateFall':
                outClass = 'pt-page-rotateFall pt-page-ontop';
                inClass = 'pt-page-scaleUp';
                break;
            case 'rotateInNewspaperRotateOutNewspaper':
                outClass = 'pt-page-rotateOutNewspaper';
                inClass = 'pt-page-rotateInNewspaper pt-page-delay500';
				delay = 500;
                break;
            case 'moveFromRightRotatePushLeft':
                outClass = 'pt-page-rotatePushLeft';
                inClass = 'pt-page-moveFromRight';
                break;
            case 'moveFromLeftRotatePushRight':
                outClass = 'pt-page-rotatePushRight';
                inClass = 'pt-page-moveFromLeft';
                break;
            case 'moveFromBottomRotatePushTop':
                outClass = 'pt-page-rotatePushTop';
                inClass = 'pt-page-moveFromBottom';
                break;
            case 'moveFromTopRotatePushBottom':
                outClass = 'pt-page-rotatePushBottom';
                inClass = 'pt-page-moveFromTop';
                break;
            case 'rotatePullRightRotatePushLeft':
                outClass = 'pt-page-rotatePushLeft';
                inClass = 'pt-page-rotatePullRight pt-page-delay180';
				delay = 180;
                break;
            case 'rotatePullLeftRotatePushRight':
                outClass = 'pt-page-rotatePushRight';
                inClass = 'pt-page-rotatePullLeft pt-page-delay180';
				delay = 180;
                break;
            case 'rotatePullBottomRotatePushTop':
                outClass = 'pt-page-rotatePushTop';
                inClass = 'pt-page-rotatePullBottom pt-page-delay180';
				delay = 180;
                break;
            case 'rotatePullTopRotatePushBottom':
                outClass = 'pt-page-rotatePushBottom';
                inClass = 'pt-page-rotatePullTop pt-page-delay180';
				delay = 180;
                break;
            case 'moveFromRightFadeRotateFoldLeft':
                outClass = 'pt-page-rotateFoldLeft';
                inClass = 'pt-page-moveFromRightFade';
                break;
            case 'moveFromLeftFadeRotateFoldRight':
                outClass = 'pt-page-rotateFoldRight';
                inClass = 'pt-page-moveFromLeftFade';
                break;
            case 'moveFromBottomFadeRotateFoldTop':
                outClass = 'pt-page-rotateFoldTop';
                inClass = 'pt-page-moveFromBottomFade';
                break;
            case 'moveFromTopFadeRotateFoldBottom':
                outClass = 'pt-page-rotateFoldBottom';
                inClass = 'pt-page-moveFromTopFade';
                break;
            case 'rotateUnfoldLeftMoveToRightFade':
                outClass = 'pt-page-moveToRightFade';
                inClass = 'pt-page-rotateUnfoldLeft';
                break;
            case 'rotateUnfoldRightMoveToLeftFade':
                outClass = 'pt-page-moveToLeftFade';
                inClass = 'pt-page-rotateUnfoldRight';
                break;
            case 'rotateUnfoldTopMoveToBottomFade':
                outClass = 'pt-page-moveToBottomFade';
                inClass = 'pt-page-rotateUnfoldTop';
                break;
            case 'rotateUnfoldBottomMoveToTopFade':
                outClass = 'pt-page-moveToTopFade';
                inClass = 'pt-page-rotateUnfoldBottom';
                break;
            case 'rotateRoomLeftInRotateRoomLeftOut':
                outClass = 'pt-page-rotateRoomLeftOut pt-page-ontop';
                inClass = 'pt-page-rotateRoomLeftIn';
                break;
            case 'rotateRoomRightInRotateRoomRightOut':
                outClass = 'pt-page-rotateRoomRightOut pt-page-ontop';
                inClass = 'pt-page-rotateRoomRightIn';
                break;
            case 'rotateRoomTopInRotateRoomTopOut':
                outClass = 'pt-page-rotateRoomTopOut pt-page-ontop';
                inClass = 'pt-page-rotateRoomTopIn';
                break;
            case 'rotateRoomBottomInRotateRoomBottomOut':
                outClass = 'pt-page-rotateRoomBottomOut pt-page-ontop';
                inClass = 'pt-page-rotateRoomBottomIn';
                break;
            case 'rotateCubeLeftInRotateCubeLeftOut':
                outClass = 'pt-page-rotateCubeLeftOut pt-page-ontop';
                inClass = 'pt-page-rotateCubeLeftIn';
                break;
            case 'rotateCubeRightInRotateCubeRightOut':
                outClass = 'pt-page-rotateCubeRightOut pt-page-ontop';
                inClass = 'pt-page-rotateCubeRightIn';
                break;
            case 'rotateCubeTopInRotateCubeTopOut':
                outClass = 'pt-page-rotateCubeTopOut pt-page-ontop';
                inClass = 'pt-page-rotateCubeTopIn';
                break;
            case 'rotateCubeBottomInRotateCubeBottomOut':
                outClass = 'pt-page-rotateCubeBottomOut pt-page-ontop';
                inClass = 'pt-page-rotateCubeBottomIn';
                break;
            case 'rotateCarouselLeftInRotateCarouselLeftOut':
                outClass = 'pt-page-rotateCarouselLeftOut pt-page-ontop';
                inClass = 'pt-page-rotateCarouselLeftIn';
                break;
            case 'rotateCarouselRightInRotateCarouselRightOut':
                outClass = 'pt-page-rotateCarouselRightOut pt-page-ontop';
                inClass = 'pt-page-rotateCarouselRightIn';
                break;
            case 'rotateCarouselTopInRotateCarouselTopOut':
                outClass = 'pt-page-rotateCarouselTopOut pt-page-ontop';
                inClass = 'pt-page-rotateCarouselTopIn';
                break;
            case 'rotateCarouselBottomInRotateCarouselBottomOut':
                outClass = 'pt-page-rotateCarouselBottomOut pt-page-ontop';
                inClass = 'pt-page-rotateCarouselBottomIn';
                break;
            case 'rotateSidesInRotateSidesOut':
                outClass = 'pt-page-rotateSidesOut';
                inClass = 'pt-page-rotateSidesIn pt-page-delay200';
				delay = 200;
                break;
            case 'rotateSlideInRotateSlideOut':
                outClass = 'pt-page-rotateSlideOut';
                inClass = 'pt-page-rotateSlideIn';
                break;
        }
        return [inClass, outClass, delay];
    }
    $.fn.mdFullScreenSlider.fxTransitions['css3'] = function(self, condition, transitionSpeed) {
        self.addTwoStrips(self.options.css3BackgroundColor);
        var inOutClass = getInOutClass(condition), inClass = inOutClass[0], outClass = inOutClass[1], delay = inOutClass[2],
		css = {
			'-moz-animation-duration': (transitionSpeed - delay) + "ms",
			'-webkit-animation-duration': (transitionSpeed - delay) + "ms",
			'-ms-animation-duration': (transitionSpeed - delay) + "ms",
			'animation-duration': (transitionSpeed - delay) + "ms"
		};
		var $pages = $('.mdslider-strip', self.slider).css(css),
			$currPage = $pages.first(),
            $nextPage = $pages.last(),
            endCurrPage = false,
            endNextPage = false;
        $currPage.addClass(outClass).bind(animEndEventName, function() {
            $currPage.unbind(animEndEventName);
            endCurrPage = true;
            if(endNextPage) {
                self.transitionEnd();
            }
        });
        $nextPage.addClass(inClass).bind(animEndEventName, function() {
            $nextPage.unbind(animEndEventName);
            endNextPage = true;
            if(endCurrPage) {
                self.transitionEnd();
            }
        });
    };
    $.fn.mdFullScreenSlider.transitions = $.fn.mdFullScreenSlider.transitions.concat([
        'css3-moveRightLeftEasing',
        'css3-moveLeftTopEasing',
        'css3-moveBottomTopEasing',
        'css3-moveFromTopMoveToBottomEasing',
        'css3-moveRightScaleDown',
        'css3-moveLeftScaleDown',
        'css3-moveBottomScaleDown',
        'css3-moveTopScaleDown',
        'css3-scaleUpDownScaleDown',
        'css3-scaleUpScaleDownUp',
        'css3-scaleUpMoveToLeft',
        'css3-scaleUpMoveToRight',
        'css3-scaleUpMoveToTop',
        'css3-scaleUpMoveToBottom',
        'css3-scaleUpCenterScaleDownCenter',
        'css3-moveFromRightRotateRightSideFirst',
        'css3-moveFromLeftRotateLeftSideFirst',
        'css3-moveFromTopRotateTopSideFirst',
        'css3-moveFromBottomRotateBottomSideFirst',
        'css3-flipInLeftFlipOutRight',
        'css3-flipInRightFlipOutLeft',
        'css3-flipInBottomFlipOutTop',
        'css3-flipInTopFlipOutBottom',
        'css3-scaleUpRotateFall',
        'css3-rotateInNewspaperRotateOutNewspaper',
        'css3-moveFromRightRotatePushLeft',
        'css3-moveFromLeftRotatePushRight',
        'css3-moveFromBottomRotatePushTop',
        'css3-moveFromTopRotatePushBottom',
        'css3-rotatePullRightRotatePushLeft',
        'css3-rotatePullLeftRotatePushRight',
        'css3-rotatePullBottomRotatePushTop',
        'css3-rotatePullTopRotatePushBottom',
        'css3-moveFromRightFadeRotateFoldLeft',
        'css3-moveFromLeftFadeRotateFoldRight',
        'css3-moveFromBottomFadeRotateFoldTop',
        'css3-moveFromTopFadeRotateFoldBottom',
        'css3-rotateUnfoldLeftMoveToRightFade',
        'css3-rotateUnfoldRightMoveToLeftFade',
        'css3-rotateUnfoldTopMoveToBottomFade',
        'css3-rotateUnfoldBottomMoveToTopFade',
        'css3-rotateRoomLeftInRotateRoomLeftOut',
        'css3-rotateRoomRightInRotateRoomRightOut',
        'css3-rotateRoomTopInRotateRoomTopOut',
        'css3-rotateRoomBottomInRotateRoomBottomOut',
        'css3-rotateCubeLeftInRotateCubeLeftOut',
        'css3-rotateCubeRightInRotateCubeRightOut',
        'css3-rotateCubeTopInRotateCubeTopOut',
        'css3-rotateCubeBottomInRotateCubeBottomOut',
        'css3-rotateCarouselLeftInRotateCarouselLeftOut',
        'css3-rotateCarouselRightInRotateCarouselRightOut',
        'css3-rotateCarouselTopInRotateCarouselTopOut',
        'css3-rotateCarouselBottomInRotateCarouselBottomOut',
        'css3-rotateSidesInRotateSidesOut',
        'css3-rotateSlideInRotateSlideOut'
    ]);
    $.fn.mdFullScreenSlider.css3Transitions = $.fn.mdFullScreenSlider.css3Transitions.concat([
        'css3-moveRightLeftEasing',
        'css3-moveLeftTopEasing',
        'css3-moveBottomTopEasing',
        'css3-moveFromTopMoveToBottomEasing',
        'css3-moveRightScaleDown',
        'css3-moveLeftScaleDown',
        'css3-moveBottomScaleDown',
        'css3-moveTopScaleDown',
        'css3-scaleUpDownScaleDown',
        'css3-scaleUpScaleDownUp',
        'css3-scaleUpMoveToLeft',
        'css3-scaleUpMoveToRight',
        'css3-scaleUpMoveToTop',
        'css3-scaleUpMoveToBottom',
        'css3-scaleUpCenterScaleDownCenter',
        'css3-moveFromRightRotateRightSideFirst',
        'css3-moveFromLeftRotateLeftSideFirst',
        'css3-moveFromTopRotateTopSideFirst',
        'css3-moveFromBottomRotateBottomSideFirst',
        'css3-flipInLeftFlipOutRight',
        'css3-flipInRightFlipOutLeft',
        'css3-flipInBottomFlipOutTop',
        'css3-flipInTopFlipOutBottom',
        'css3-scaleUpRotateFall',
        'css3-rotateInNewspaperRotateOutNewspaper',
        'css3-moveFromRightRotatePushLeft',
        'css3-moveFromLeftRotatePushRight',
        'css3-moveFromBottomRotatePushTop',
        'css3-moveFromTopRotatePushBottom',
        'css3-rotatePullRightRotatePushLeft',
        'css3-rotatePullLeftRotatePushRight',
        'css3-rotatePullBottomRotatePushTop',
        'css3-rotatePullTopRotatePushBottom',
        'css3-moveFromRightFadeRotateFoldLeft',
        'css3-moveFromLeftFadeRotateFoldRight',
        'css3-moveFromBottomFadeRotateFoldTop',
        'css3-moveFromTopFadeRotateFoldBottom',
        'css3-rotateUnfoldLeftMoveToRightFade',
        'css3-rotateUnfoldRightMoveToLeftFade',
        'css3-rotateUnfoldTopMoveToBottomFade',
        'css3-rotateUnfoldBottomMoveToTopFade',
        'css3-rotateRoomLeftInRotateRoomLeftOut',
        'css3-rotateRoomRightInRotateRoomRightOut',
        'css3-rotateRoomTopInRotateRoomTopOut',
        'css3-rotateRoomBottomInRotateRoomBottomOut',
        'css3-rotateCubeLeftInRotateCubeLeftOut',
        'css3-rotateCubeRightInRotateCubeRightOut',
        'css3-rotateCubeTopInRotateCubeTopOut',
        'css3-rotateCubeBottomInRotateCubeBottomOut',
        'css3-rotateCarouselLeftInRotateCarouselLeftOut',
        'css3-rotateCarouselRightInRotateCarouselRightOut',
        'css3-rotateCarouselTopInRotateCarouselTopOut',
        'css3-rotateCarouselBottomInRotateCarouselBottomOut',
        'css3-rotateSidesInRotateSidesOut',
        'css3-rotateSlideInRotateSlideOut'
    ]);
})(jQuery);
;
