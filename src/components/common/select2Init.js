import $ from "jquery";
import "select2";
import { getLocalStorage, guardKey } from "../../global";

export function initSelect2(reset = false) {
  var elements = $('[data-control="select2"]');
  if (!Array.isArray(elements)) {
    elements = [elements];
  }

  $('[data-control="select2"]').each(function () {
    let va_l = $(this).attr("data-value");
    if (va_l) {
      var items = va_l.split(",");
      $(this).val(items);
    }
    $(this).select2({
      width: "100%",
      escapeMarkup: function (markup) {
        return markup;
      },
      minimumResultsForSearch: "Infinity",
      ajax: {
        type: "POST",
        url: function (params) {
          return $(this).attr("data-ajax-preload");
        },
        headers: {
          "Guard-Key": guardKey,
          Authorization: `Bearer ${getLocalStorage("token")}`,
        },
        dataType: "json",
        delay: 250,
        data: function (params) {
          return {
            q: params.term,
            page: params.page,
          };
        },
        processResults: function (data, params) {
          params.page = params.page || 1;
          return {
            results: data.data,
            pagination: {
              more: !!data.next_page_url,
            },
          };
        },
        cache: true,
      },
    });
  });
}
