// src/composables/useGlobalScripts.js
export function useGlobalScripts() {
    const loadScript = (src) => {
        if (document.querySelector(`script[src="${src}"]`)) return
        const script = document.createElement('script')
        script.src = src
        script.async = false
        document.body.appendChild(script)
    }

    const loadCommonScripts = () => {
        loadScript('/vendors/jquery/dist/jquery.min.js')
        loadScript('/vendors/bootstrap/dist/js/bootstrap.bundle.min.js')
        loadScript('/vendors/fastclick/lib/fastclick.js')
        loadScript('/vendors/iCheck/icheck.min.js')
        loadScript('/vendors/datatables.net/js/jquery.dataTables.min.js')
        loadScript('/vendors/datatables.net-bs/js/dataTables.bootstrap.min.js')
        loadScript('/vendors/datatables.net-buttons/js/dataTables.buttons.min.js')
        loadScript('/vendors/datatables.net-buttons-bs/js/buttons.bootstrap.min.js')
        loadScript('/vendors/datatables.net-buttons/js/buttons.flash.min.js')
        loadScript('/vendors/datatables.net-buttons/js/buttons.html5.min.js')
        loadScript('/vendors/datatables.net-buttons/js/buttons.print.min.js')
        loadScript('/vendors/datatables.net-fixedheader/js/dataTables.fixedHeader.min.js')
        loadScript('/vendors/datatables.net-keytable/js/dataTables.keyTable.min.js')
        loadScript('/vendors/datatables.net-responsive/js/dataTables.responsive.min.js')
        loadScript('/vendors/datatables.net-responsive-bs/js/responsive.bootstrap.js')
        loadScript('/vendors/datatables.net-scroller/js/dataTables.scroller.min.js')
        loadScript('/vendors/Chart.js/dist/Chart.min.js')
        loadScript('/vendors/jquery-sparkline/dist/jquery.sparkline.min.js')
        loadScript('/vendors/Flot/jquery.flot.js')
        loadScript('/vendors/Flot/jquery.flot.pie.js')
        loadScript('/vendors/Flot/jquery.flot.time.js')
        loadScript('/vendors/Flot/jquery.flot.stack.js')
        loadScript('/vendors/Flot/jquery.flot.resize.js')
        loadScript('/vendors/flot.orderbars/js/jquery.flot.orderBars.js')
        loadScript('/vendors/flot-spline/js/jquery.flot.spline.min.js')
        loadScript('/vendors/flot.curvedlines/curvedLines.js')
        loadScript('/vendors/DateJS/build/date.js')
        loadScript('/vendors/moment/min/moment.min.js')
        loadScript('/vendors/bootstrap-daterangepicker/daterangepicker.js')
        loadScript('/vendors/jszip/dist/jszip.min.js')
        loadScript('/vendors/pdfmake/build/pdfmake.min.js')
        loadScript('/vendors/pdfmake/build/vfs_fonts.js')
        loadScript('/build/js/custom.min.js')
    }

    return { loadCommonScripts }
}
