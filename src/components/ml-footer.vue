<template>
  <footer id="footer" class="powered">
    <div class="container">
      <div class="row">
        <div class="col-sm-12">
          <div class="social-links">
            <a href="https://www.facebook.com/marklogic" title="Facebook" rel="external">
            <img src="../assets/images/facebook.svg" alt="Facebook" title="Facebook"></a>
            <a href="https://twitter.com/marklogic" title="Twitter" rel="external">
            <img src="../assets/images/twitter.svg" alt="Twitter" title="Twitter"></a>
            <a href="http://www.linkedin.com/company/marklogic" title="LinkedIn" rel="external">
            <img src="../assets/images/linkedin.svg" alt="LinkedIn" title="LinkedIn"></a>
            <a href="https://www.flickr.com/photos/marklogicuc/" title="Flickr" rel="external">
            <img src="../assets/images/flickr.svg" alt="Flickr" title="Flickr"></a>
            <a href="https://www.youtube.com/channel/UCT2Q5qhC2gmd89K9qpV2TrQ" title="YouTube" rel="external">
            <img src="../assets/images/youtube.svg" alt="YouTube" title="YouTube"></a>
            <a href="https://plus.google.com/+MarklogicCo/posts" title="Google+" rel="external">
            <img src="../assets/images/google.svg" alt="Google+" title="Google+"></a>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12">
          <ul id="menu-footer-navigation-logged-in" class="nav">
            <li id="menu-item-140" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-140">
              <a target="_blank" href="http://www.marklogic.com">MarkLogic.com</a>
            </li>
            <li id="menu-item-71" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-71">
              <a target="_blank" href="http://developer.marklogic.com">MarkLogic Developers</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="row copyright">
        <div class="col-sm-12 text-muted">
          Copyright <sup>&copy;</sup> {{ currentYear }} MarkLogic Corporation. MARKLOGIC <sup>&reg;</sup> is a registered trademark of MarkLogic Corporation.
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'ml-footer',
  data() {
    return {
      currentYear: new Date().getUTCFullYear()
    };
  }
};
</script>
