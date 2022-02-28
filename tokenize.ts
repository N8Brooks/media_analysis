/** Based on original Penn Treebank tokenization method */
export const tokenize = (s: string): string[] => {
  // # attempt to get correct directional quotes
  // s=^"=`` =g
  // s=\([ ([{<]\)"=\1 `` =g
  // # close quotes handled at end
  s = s.replace(/^"/, "`` ");
  s.replace(/([ ([{<])"/g, " $1 ");

  // s=\.\.\.= ... =g
  // s=[,;:@#$%&]= & =g
  s = s.replaceAll("...", " ... ");
  s = s.replace(/[,;:@#$%&]/g, " $& ");

  // # Assume sentence tokenization has been done first, so split FINAL periods
  // # only.
  // s=\([^.]\)\([.]\)\([])}>"']*\)[ 	]*$=\1 \2\3 =g
  // # however, we may as well split ALL question marks and exclamation points,
  // # since they shouldn't have the abbrev.-marker ambiguity problem
  // s=[?!]= & =g
  s = s.replace(/([^.])(\.)([\])}>"']*)\s*$/g, "$1 $2$3");
  s = s.replace(/[!?]/g, " $& ");

  // # parentheses, brackets, etc.
  // s=[][(){}<>]= & =g
  s = s.replaceAll(/[\[\]\(\)\{\}<>]/g, " $& ");

  // # Some taggers, such as Adwait Ratnaparkhi's MXPOST, use the parsed-file
  // # version of these symbols.
  // # UNCOMMENT THE FOLLOWING 6 LINES if you're using MXPOST.
  // # s/(/-LRB-/g
  // # s/)/-RRB-/g
  // # s/\[/-LSB-/g
  // # s/\]/-RSB-/g
  // # s/{/-LCB-/g
  // # s/}/-RCB-/g

  // s=--= -- =g
  s = s.replaceAll("--", " -- ");

  // # NOTE THAT SPLIT WORDS ARE NOT MARKED.  Obviously this isn't great, since
  // # you might someday want to know how the words originally fit together --
  // # but it's too late to make a better system now, given the millions of
  // # words we've already done "wrong".

  // # First off, add a space to the beginning and end of each line, to reduce
  // # necessary number of regexps.
  // s=$= =
  // s=^= =
  s = ` ${s} `;

  // s="= '' =g
  // # possessive or close-single-quote
  // s=\([^']\)' =\1 ' =g
  s = s.replaceAll('"', " '' ");
  s = s.replace(/(^')'/g, "$1 ' ");

  // # as in it's, I'm, we'd
  // s='\([sSmMdD]\) = '\1 =g
  // s='ll = 'll =g
  // s='re = 're =g
  // s='ve = 've =g
  // s=n't = n't =g
  // s='LL = 'LL =g
  // s='RE = 'RE =g
  // s='VE = 'VE =g
  // s=N'T = N'T =g
  s = s.replace(/'([smd])/gi, " '$1 ");
  s = s.replaceAll("'ll", " 'll");
  s = s.replaceAll("'re", " 're");
  s = s.replaceAll("'ve", " 've");
  s = s.replaceAll("n't", " n't");
  s = s.replaceAll("'LL", " 'LL");
  s = s.replaceAll("'RE", " 'RE");
  s = s.replaceAll("'VE", " 'VE");
  s = s.replaceAll("N'T", " N'T");

  // s= \([Cc]\)annot = \1an not =g
  // s= \([Dd]\)'ye = \1' ye =g
  // s= \([Gg]\)imme = \1im me =g
  // s= \([Gg]\)onna = \1on na =g
  // s= \([Gg]\)otta = \1ot ta =g
  // s= \([Ll]\)emme = \1em me =g
  // s= \([Mm]\)ore'n = \1ore 'n =g
  // s= '\([Tt]\)is = '\1 is =g
  // s= '\([Tt]\)was = '\1 was =g
  // s= \([Ww]\)anna = \1an na =g
  // # s= \([Ww]\)haddya = \1ha dd ya =g
  // # s= \([Ww]\)hatcha = \1ha t cha =g
  s = s.replace(/([Cc])annot /g, "$1an not ");
  s = s.replace(/([Dd])'ye /g, "$1' ye ");
  s = s.replace(/([Gg])imme /g, "$1im me ");
  s = s.replace(/([Gg])onna /g, "$1on na ");
  s = s.replace(/([Gg])otta /g, "$1ot ta ");
  s = s.replace(/([Ll])emme /g, "$1em me ");
  s = s.replace(/([Mm])ore'n /g, "$1ore 'n ");
  s = s.replace(/([Tt])is /g, "'$1 is ");
  s = s.replace(/([Tt])was /g, "'$1 was ");
  s = s.replace(/([Ww])anna /g, "$1an na ");

  // # clean out extra spaces
  // s=  *= =g
  // s=^ *==g
  return s.trim().split(/\s+/);
};
