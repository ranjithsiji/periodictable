// based on Bowserinator/Periodic-Table-JSON
// https://github.com/Bowserinator/Periodic-Table-JSON/blob/master/PeriodicTableJSON.json

$(function() {

  const fadeInDuration = 1.5;

  // DOM elements to be created
  let $cels,
    $elements,
    $celDisplayName,
    $celDisplayLan,
    $celDisplayAct,
    $rowDisplayLan,
    $rowDisplayAct,
    $electronsSet,
    $currentElement;

  // cache DOM
  let $cel = $('.cel'),
    $tableau = $( '#tableau' ),
    $periode = $tableau.find( '.periode' ),
    $celLanthanidesText = $tableau.find( '.lanthanide' ),
    $celActinidesText = $tableau.find( '.actinide' ),
    $rowLanthanidesText = $tableau.find( '.lanthanides-row' ),
    $rowActinidesText = $tableau.find( '.actinides-row' ),
    $legende = $( '#legende' ),
    $orbitesSet = $( '#orbites-set' ),
    $protonsSet = $( '#protons-set' ),
    $presElem = $( '#pres-element' ),
    $presContent = $presElem.find( '#pres-content' ),
    $description = $presContent.find( '#description' ),
    $presNom = $description.find( '#presentation-nom' ),
    $presProtonText = $description.find( '#pres-proton-text' ),
    $presElecText = $description.find( '#pres-elec-text' ),
    $presElecTable = $description.find( '#pres-elec-table' ),
    $presCaracText = $description.find( '#pres-carac-text' ),
    $close = $presContent.find( '#close' );

  // Fn removing space and "é" from family name > create class names
  function createClass( chaine ) {

    chaine = chaine.split( ' ' ).join( '-' ).replace( /é/g, "e" );
    return chaine;
  }

  function transitionValues( index, duration, elemSet ) {
    // for each of the targeted elements, distribute animation delay and duration in order to have each set of elements fully animated at the end of the global duration
    let elemCount = elemSet.length;
    let durationPerElem = duration / elemCount;
    let delay = durationPerElem * index;
    let newDuration = duration - delay;

    let transValues = {
      delay: delay,
      duration: newDuration,
    }

    return transValues;
  }

  function animate( elem, initialClass, newClass, duration ) {
  // animate function should be used only once on a set of elements
  // if used twice, css transition property should be all, delay & duration would be calculated twice
    elem.addClass( initialClass );

    setTimeout( function() { // delay transition return : avoid class interferences

      elem
        .removeClass( initialClass )
        .addClass( newClass )
        .each(function( index ) {

        let transValues = transitionValues( index, duration, elem );

        $( this )
          .css({
            'transition-delay': transValues.delay + 's',
            'transition-duration': transValues.duration + 's'
          });
      });

    }, 100);

  };

  // add cels into the table
  let tableau = (function() {

    let celsToRemove = [
      $cel
    ];

    $( celsToRemove ).each(function() {
      $( this ).remove();
    });

    function appendCels( period, newCel ) {
      $( period ).append( newCel );
    };

    function addDataColIndex( period, cels ) {
      $( period ).find( cels ).each(function( index ) {
        $( this ).attr( 'data-col', index );
      });
    };

    $periode.each(function() {
      for ( let i = 0; i < 19; i++ ) {
        let newCel = $cel.clone();
        appendCels( this, newCel );
        $cels = $( '.cel' );
        addDataColIndex( this, $cels )
      }
    });

    function insertIndex( elem ) {
      elem.each(function( i ) {
        $( this )
          .addClass( 'index opacity-zero' )
          .html( '<span class="index-value">' + i + '</span>' );
      });
    };

    let celsIndex = [
      $( '#periode-0 .cel' ),
      $( '.cel[data-col="0"]' ),
    ];

    celsIndex.forEach(function( elem ) {
      insertIndex( elem );
    });

    $celDisplayLan = $( $periode[6] ).find( '[data-col="3"]' );
    $celDisplayAct = $( $periode[7] ).find( '[data-col="3"]' );
    $rowDisplayLan = $( $periode[9] ).find( '[data-col="2"]' );
    $rowDisplayAct = $( $periode[10] ).find( '[data-col="2"]' );

    $celDisplayLan.addClass( 'opacity-zero' ).html( $celLanthanidesText );
    $celDisplayAct.addClass( 'opacity-zero' ).html( $celActinidesText );
    $rowDisplayLan.addClass( 'unhover-arrow opacity-zero' ).html( $rowLanthanidesText );
    $rowDisplayAct.addClass( 'unhover-arrow opacity-zero' ).html( $rowActinidesText );

    $( $celDisplayLan ).children().removeClass( 'opacity-zero' );
    $( $celDisplayAct ).children().removeClass( 'opacity-zero' );
    $( $rowDisplayLan ).children().removeClass( 'opacity-zero' );
    $( $rowDisplayAct ).children().removeClass( 'opacity-zero' );

  })();


  // insert data in the table > called in dataElements
  function celsContent( index, elemValues ) {

    $currentElement = $( '#periode-' + elemValues.ypos + ' .cel[data-col="' + elemValues.xpos + '"]' );

    // add data for each cel containing element
    $currentElement
      .addClass( 'element' )
      .attr( 'data-atomic-number', elemValues.num )
      .html( `
        <div class="${elemValues.familleClass}">
          <div class="num">${elemValues.num}</div>
          <div class="symbol">${elemValues.symbol}</div>
          <div id="nom-${index+1}" class="nom">${elemValues.name}</div>
          <div class="masse">${elemValues.mass}</div>
        </div>
      ` )
      .click(function() {

        elemPresEmpty();
        elemPresCreation( elemValues );
        elemPresData( elemValues );
        elemPresDisplay( elemValues );
        elemPresAnim();

    });
  };

  // Display element names in an empty cel > called in dataElements
  let tableauNameDisplay = function() {
    $celDisplayName = $( $periode[3] ).find( '[data-col="3"]' );
    $celDisplayName.addClass( 'display-name' );
    $( '.cel .nom' ).appendTo( $celDisplayName );
  };

  // create family legend > called in dataElements
  function insertLegend( legendFamUnique ) {

    $.each( legendFamUnique, function( index, value ) {

      let familleClass = createClass( value );
      $legende.append(`
        <div class="legende-famille opacity-zero">
          <div class="legende-coul ${familleClass}"></div>
          <div class="legende-fond ${familleClass} legende-out"></div>
          <div class="legende-nom legende-nom-out">${value}</div>
        </div>
      `)
    });
  }

  // hover effects on cels : elem name diplay, legend background slide and color change > called in dataElements
  function hoverCel() {

    // delay after cels appearence
    setTimeout( function() {

      $elements = $( '.element' );

      $elements.each(function() {

        let atomNum = $( this ).attr( 'data-atomic-number' );
        let famille = $( 'div', this ).attr( 'class' );
        let $nomId = $( '#nom-' + atomNum );
        let $legendeFamilleFond = $( '#legende .' + famille + '.legende-fond' );
        let $legendeFamilleText = $legendeFamilleFond.next();

        $( this ).hover(function() {

          $nomId.addClass( "nom-visible" );
          $legendeFamilleFond.removeClass( "legende-out" ).addClass( "legende-survol" );
          $legendeFamilleText.removeClass( "legende-nom-out").addClass( "legende-nom-survol" );
        }, function() {
          $nomId.removeClass( "nom-visible" );
          $legendeFamilleFond.removeClass( "legende-survol" ).addClass( "legende-out" );
          $legendeFamilleText.removeClass( "legende-nom-survol").addClass( "legende-nom-out" );
        });
      });

      $( $celDisplayLan ).hover(function() {
        $rowDisplayLan.removeClass( "unhover-arrow" ).addClass( "hover-arrow" );
      }, function() {
        $rowDisplayLan.removeClass( "hover-arrow" ).addClass( "unhover-arrow" );
      });

      $( $celDisplayAct ).hover(function() {
        $rowDisplayAct.removeClass( "unhover-arrow" ).addClass( "hover-arrow" );
      }, function() {
        $rowDisplayAct.removeClass( "hover-arrow" ).addClass( "unhover-arrow" );
      });

    }, fadeInDuration * 1000 );

  }

  function animateCels( legendFamUnique ) {

    let famClassArray = [];

    $.each( legendFamUnique, function() {
      let famClass = createClass( this );
      famClassArray.push( famClass );
    });

    $.each( famClassArray, function() {
      let elems = $( '.' + this ).parent( '.element' );
      animate( elems, 'opacity-zero', 'opacity-one', fadeInDuration );
    });

    let notElems = [
      $( '#entete-period' ),
      $( '#entete-group' ),
      $( '.index' ),
      $celDisplayName,
      $celDisplayLan,
      $celDisplayAct,
      $rowDisplayLan,
      $rowDisplayAct,
      $( '.legende-famille' ),
    ];

    setTimeout( function() {
      $.each( notElems, function() {
        animate( this, 'opacity-zero', 'opacity-one', fadeInDuration );
      });
    }, fadeInDuration * 1000 );

  };

  /**
   * Elements presentation : pop-up when clicked
   */

  // empty previous data > called on click in celsContent()
  let elemPresEmpty = function() {
    $( '.data-content' ).remove();
  };

  // insert new elements > called on click in celsContent()
  let elemPresCreation = function( elemValues ) {
    // for each shell, create orbital circles
    for ( let i = 0; i < elemValues.couches; i++ ) {
      $( '#orbitales' ).append( `<div class="electrons-set data-content"></div>` );
      $electronsSet = $( '.electrons-set' );
      let electrons = elemValues.couche[i];
      for ( let j = 0; j < electrons; j++ ) {
        $( $electronsSet[i] ).append( `<div class="electron ${elemValues.familleClass}"></div>` );
      }
      let $electron = $( $electronsSet[i] ).find( '.electron' );
      if ( $electron.length ) {
        $orbitesSet.prepend( '<div class="orbite data-content"></div>' );
      }
    }
    // create core
    $protonsSet.append( `<div class="proton ${elemValues.familleClass} data-content"></div>` );
  }

// insert data in element presentation > called on click in celsContent()
  let elemPresData = function( elemValues ) {

    // add element data
    $presNom.append( `<span class="data-content">${elemValues.name}</span>` );
    $presProtonText.append( `<p class="data-content">${elemValues.protons} protons</p>` );
    $presElecText.append( `<p class="data-content">${elemValues.protons} electrons on ${elemValues.couches} shells</p>` );
    $presCaracText.append( `<ul class="data-content">
      <li><strong>Category</strong> : ${elemValues.famille}</li>
      <li><strong>Appearance</strong> : ${elemValues.appearance}</li>
      <li><strong>Atomic mass</strong> : ${elemValues.atomic_mass}</li>
      <li><strong>Boiling point</strong> : ${elemValues.boil} K</li>
      <li><strong>Density</strong> : ${elemValues.density} g/L</li>
      <li><strong>Discovered by</strong> : ${elemValues.discovered_by}</li>
      <li><strong>Melting point</strong> : ${elemValues.melt} K</li>
      <li><strong>Molar heat capacity</strong> : ${elemValues.molar_heat} J/(mol·K)</li>
      <li><strong>Named by</strong> : ${elemValues.named_by}</li>
      <li><strong>Atomic number</strong> : ${elemValues.num}</li>
      <li><strong>Period</strong> : ${elemValues.period}</li>
      <li><strong>Phase</strong> : ${elemValues.phase}</li>
      <li><strong>Source</strong> : <a href="${elemValues.source}" target="_blank">Wikipedia</a></li>
      <li><strong>Summary</strong> : ${elemValues.summary}</li>
      <li><strong>Symbol</strong> : ${elemValues.symbol}</li>
    </ul>` );

    // fill electron table
    for ( let i = 0; i < elemValues.couche.length; i++ ) {
      let tableIndex = i + 1;
      $presElecTable
        .find( 'thead tr' )
        .append( '<td class="data-content">' + tableIndex +'</td>' );
    }
    let electronsParCouches = elemValues.couche.map( electrons => (
      '<td class="data-content">' + electrons + '</td>'
      ) );
    $presElecTable.find( 'tbody tr' ).append( electronsParCouches );

  }

  /**
   *  Placing & styling element > called on click in celsContent()
   */

  let elemPresDisplay = function( elemValues ) {

    // show element window
    $presElem.fadeIn( 1000 );

    // add family classes for colors
    $presContent.removeClass().addClass( elemValues.familleClass +'-back' );
    $description.find( 'tr' ).each(function() {
      $( this ).find( 'td:odd' ).addClass( elemValues.familleClass );
    });

    // Orbitals/shells

    let
      angles = [0],
      radius = [],
      margins = [];

    // 32 angle values por electron position
    for ( let i = 1; i < 32; i++ ) {
      let theta = ( ( 2 * Math.PI ) / 32 ) * i;
      angles.push( theta );
    }

    // 8 radius for the orbitals
    for ( let i = 1; i < 8; i++ ) {
      let rayon = 20 + ( ( 30 / 7 ) * i );
      radius.push( rayon );
    }

    // set orbitals size & place
    $( '.orbite' ).each(function( index ) {

      let size = radius[index] * 2 + '%';
      let margin = ( ( 100 - ( radius[index] * 2 ) ) / 2 );
      margins.push( margin );

      $( this ).css({
        'width' : size,
        'height' : size,
        'margin-left' : margin + '%',
        'margin-top' : margin + '%',
      });
    });

    // get electron width, convert width in percentage
    let $electron = $( '.electron' )[0];
    let elemDiameter = parseFloat( $( $electron ).css( 'width' ) );
    elemDiameter = ( elemDiameter * 100 ) / parseFloat( $( $electron ).parent().css( 'width' ) );

    // Fn : radial css position
    function disqPos( elem, radius, angle, margin ) {

      $( elem ).css({
        'left' :
          radius * ( Math.cos( angle )) // circle x position
          + radius // add radius, place it to the edge
          + margin // add parent margin
          - ( elemDiameter / 2 ) // remove electron radius
          + '%',
        'top' :
          radius * ( Math.sin( angle )) // circle y position
          + radius // add radius, place it to the edge
          + margin // add parent margin
          - ( elemDiameter / 2 ) // remove electron radius
          + '%',
      });

    }

    // Place electrons
    for ( let i = 0; i < elemValues.couches; i++ ) {

      let $electron = $( $electronsSet[i] ).find( '.electron' );
      $electron.each(function( index ) {

        disqPos( this, radius[i], angles[index], margins[i] );

      });

    }
  }

   // Animate presentation element > called on click in celsContent()

  let elemPresAnim = function() {

    const duration = 3; // Animation global duration

    const elemSetsToAnimate = [
      { elem: $presNom },
      { elem: $protonsSet },
      { elem: $electronsSet, rotation: true },
      { elem: $orbitesSet },
      { elem: $presProtonText },
      { elem: $presElecText },
      { elem: $presElecTable.find( 'th' ) },
      { elem: $( '#presentation-text table thead tr' ) },
      { elem: $( '#presentation-text table tbody tr' ) },
      { elem: $presCaracText.find( 'ul' ) }
    ];

    $( elemSetsToAnimate ).each(function() {

      let children = $( this.elem ).children();
      let initialClass = 'opacity-zero';
      let newClass = 'opacity-one';

      animate( children, initialClass, newClass, duration );

      if ( this.rotation == true ) {

        let elemToRotate = this.elem;
        let initialClass = 'electrons-set-start';
        let newClass = 'electrons-set-transition';

        animate( elemToRotate, initialClass, newClass, duration );
      }

    });

  }

  let closePresentation = (function() {
    $close.click(function() {
      $presElem.fadeOut( 500 );
    });
  })();


  let dataElements = (function() {

    // will contain the list of element categories
    let legendFam = [];

    // reduce categories like "unknow, probably..." to one
    function uniqueUnknowFamily( chaine ) {
      if ( chaine.startsWith( "unknown" ) ) {
        chaine = "unknown";
      }
      return chaine;
    }

    $.ajax( {
      url: 'https://cdn.jsdelivr.net/gh/Bowserinator/Periodic-Table-JSON/PeriodicTableJSON.json',
      dataType: 'json',
      type:'get',
      success: function( data ) {

        $( data.elements ).each(function( index, value ) {

          let elemValues = {
            num: value.number,
            symbol: value.symbol,
            name: value.name,
            mass: value.atomic_mass,
            famille: value.category,
            familleUniqueUnknow: uniqueUnknowFamily( value.category ),
            familleClass: createClass( uniqueUnknowFamily( value.category ) ),
            appearance: value.appearance,
            atomic_mass: value.atomic_mass,
            boil: value.boil,
            density: value.density,
            discovered_by: value.discovered_by,
            melt: value.melt,
            molar_heat: value.molar_heat,
            named_by: value.named_by,
            period: value.period,
            phase: value.phase,
            source: value.source,
            summary: value.summary,
            couche: value.shells,
            couches: ( value.shells ).length,
            protons: value.number,
            xpos: value.xpos,
            ypos: value.ypos,
          }

          legendFam.push( elemValues.familleUniqueUnknow );
          celsContent( index, elemValues );
          tableauNameDisplay();

        });

        let legendFamUnique = [...new Set( legendFam )]; // family : new array of unique names

        insertLegend( legendFamUnique );
        animateCels( legendFamUnique );
        hoverCel();

      }
    });

  })();

});
